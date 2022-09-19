import {createContext, useContext} from "react";
import {Session} from "../model/Session";

export interface ISessionContext {
    logout: () => void,
    session: Session,
    setSession: (session: Session) => void,
}

export const SessionContext = createContext<ISessionContext>({
    session: new Session(),
    logout: () => {},
    setSession: () => {},
});
export const useSession = () => useContext(SessionContext);
