import { StateProps } from "./AuthProvider";

export type ActionProps =
    | { type: "authenticate"; data: UserData }
    | { type: "logout" };

type UserData = {
    email: string;
    username: string;
};
export const AuthReducer = (state: StateProps, action: ActionProps) => {
    switch (action.type) {
        case "authenticate": {
            return {
                email: action.data.email,
                username: action.data.username,
                isAuth: true,
            };
        }
        case "logout": {
            return {
                isAuth: false,
                username: "",
                email: "",
            };
        }
        default: {
            return state;
        }
    }
};
