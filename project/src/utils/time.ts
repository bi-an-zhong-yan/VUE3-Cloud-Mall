//封装函数：获取一个结果：当前早上|上午|下午|晚上
export const getTime=()=>{
    let message=''
    //内置函数判断构造函数Date
    let Hours = new Date().getHours()
    if(Hours<=9){
        message='早上'
    }else if(Hours<=12){
        message='上午'
    }else if(Hours<=18){
        message='下午'
    }else{
        message='晚上'
    }
return message   
}
