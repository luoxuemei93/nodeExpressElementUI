//获取当前时刻的时间
// type = 1年月日，type=2时分秒,type=其他，年月日时分秒，fommatter="-"表示年月日用-隔开，否则用"/"隔开
export function curTimeFun(type,fommatter) {
    const myDate = new Date();
    const year = myDate.getFullYear()>9?myDate.getFullYear():'0'+myDate.getFullYear();
    const month = (myDate.getMonth() + 1)>9?myDate.getMonth() + 1:'0'+(myDate.getMonth() + 1);
    const date = myDate.getDate()>9?myDate.getDate():'0'+myDate.getDate();
    const h = myDate.getHours()>9?myDate.getHours():'0'+myDate.getHours();       //获取当前小时数(0-23)
    const m = myDate.getMinutes()>9?myDate.getMinutes():'0'+myDate.getMinutes();     //获取当前分钟数(0-59)
    const s = myDate.getSeconds()>9?myDate.getSeconds():'0'+myDate.getSeconds();
    let nowTime = "";
    if(type == '1'){
        if(fommatter == '-') {
            nowTime = year + '-' + month + "-" + date;
        } else {
            nowTime = year + '/' + month + "/" + date;
        }
    } else if(type == '2'){
        nowTime = h + ':' + m + ":" + s;
    } else {
        if(fommatter == '-') {
            nowTime = year + '-' + month + "-" + date + " " + h + ':' + m + ":" + s;
        } else {
            nowTime = year + '/' + month + "/" + date + " " + h + ':' + m + ":" + s;
        }
    }
    return nowTime;
}


