
import { GoogleGenAI } from "@google/genai";
import { SearchResult, FirmCase } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchCaseUpdates(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search e-Courts (services.ecourts.gov.in), aphc.gov.in, and tshc.gov.in for the specific case: ${query}. 
      
      Look for:
      1. What was written in the 'Daily Order' or 'Proceedings' today.
      2. The current status (Pending/Adjourned/Disposed).
      3. The next hearing date.
      
      Format exactly:
      CASE_SUMMARY_START
      Case Number: [Number]
      Current Status: [Status]
      Next Hearing Date: [Date]
      Judge: [Name]
      Court: [Name]
      Stage: [Stage]
      CASE_SUMMARY_END`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Status not yet updated in e-Courts for today.";
    const sources: SearchResult[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Legal Portal",
      uri: chunk.web?.uri || ""
    })).filter((s: SearchResult) => s.uri !== "") || [];

    return { text, sources, isError: false };
  } catch (error) {
    return { text: "Connection to e-Courts is delayed. Try again shortly.", sources: [], isError: true };
  }
}

export async function fetchFirmCaseList(names: string[]) {
  try {
    const namesQuery = names.join(", ");
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a deep search of Guntur District Courts, Andhra Pradesh High Court, and Telangana High Court for all cases handled by: ${namesQuery}.
      
      I need to know the EXACT status today.
      For every case found, provide:
      CASE_ITEM_START
      CaseNumber: [Case No/Year]
      Advocate: [Name]
      Parties: [P vs R]
      Status: [Status]
      NextDate: [Date]
      Location: [Guntur/APHC/TSHC]
      TodayUpdate: [What is written in the orders/proceedings today?]
      Link: [Direct Link to file in e-Courts]
      CASE_ITEM_END`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const cases: FirmCase[] = [];
    const caseRegex = /CASE_ITEM_START([\s\S]*?)CASE_ITEM_END/g;
    let match;

    while ((match = caseRegex.exec(text)) !== null) {
      const content = match[1];
      const extract = (label: string) => {
        const regex = new RegExp(`${label}:\\s*(.*)`, 'i');
        return content.match(regex)?.[1]?.trim() || "N/A";
      };

      cases.push({
        caseNumber: extract('CaseNumber'),
        advocate: extract('Advocate'),
        parties: extract('Parties'),
        status: extract('Status'),
        nextDate: extract('NextDate'),
        courtLocation: extract('Location'),
        todayUpdate: extract('TodayUpdate'),
        portalLink: extract('Link')
      });
    }

    return { cases, rawBriefing: text };
  } catch (error) {
    return { cases: [], rawBriefing: "Network error during firm sync." };
  }
}

export async function getLiveCourtBoard(court: "TG" | "AP") {
  try {
    const url = court === "TG" ? "tshc.gov.in" : "aphc.gov.in";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Get the LIVE Display Board for ${url}. I need CH Number, Judge, and currently running Serial Number.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { 
      text: response.text || "Display board stream unavailable.", 
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ title: c.web?.title, uri: c.web?.uri })) || [] 
    };
  } catch (error) {
    return { text: "Error connecting to Live Board.", sources: [] };
  }
}
