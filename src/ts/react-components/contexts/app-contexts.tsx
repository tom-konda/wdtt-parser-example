import { createContext, Dispatch } from "react";
import { timetableState } from "../../declaration/wdtt-viewer";

export const WDTTContext = createContext<timetableState>(undefined as any);
export const DispatchContext = createContext<Dispatch<any>>(null as any);