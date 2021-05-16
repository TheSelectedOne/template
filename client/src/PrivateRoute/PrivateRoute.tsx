import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext, StateProps } from "../State/Auth/AuthProvider";

interface Props {
    path: string;
    component: React.FC;
    exact: boolean
}

export const PrivateRoute = ({ path, component, exact }: Props) => {
    const { authState }: any = useContext(AuthContext);
    if (!authState.isAuth) return <Redirect to="/login" />;
    return <Route path={path} {...exact && exact} component={component} />;
};
