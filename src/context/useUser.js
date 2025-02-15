import { useContext } from "react";
import { UserContext } from "../main";
import http from '../http';


function useUser() {
    const {setUser, user, userLoading} = useContext(UserContext);
    const getUser = async () => {
        console.log(user);
    }

    const refreshUser = async () => {
        const res = await http.get("/auth/refresh");
        if (res.status === 200) {
            setUser(res.data.user);
            localStorage.setItem("accessToken", res.data.token)
            console.log("local token refreshed");
        }
    }

    return { user, getUser, refreshUser, userLoading };
}

export default useUser;