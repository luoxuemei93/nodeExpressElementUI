const page = {
    state: {
        userInfoState:'',
    },
    mutations: {
        userInfoMut(state,data){
            console.log("pagejs="+data);
            state.userInfoState = data;
            console.log(state.userInfoState);
        },
    },
    actions: {

    }
}
export default page;
