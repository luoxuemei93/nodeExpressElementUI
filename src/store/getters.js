import store from "./index";
const getters = {
    // userInfoGetter:state => state.page.userInfoState,     // 登陆账号
    userInfoGetter: (state, getters) => {
        return state.page.userInfoState;
    }
};
export default getters
