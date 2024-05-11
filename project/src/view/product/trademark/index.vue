<template>
    <el-card class="box-card">
        <!--卡片顶部添加品牌的按钮-->
        <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
        <!--表格组件：用于展示已有的品牌-->

        <!--
                table属性
                    border:可以设置表格纵向是否有边框
                table-column属性
                    lable:某一个列表
                    width：可设置宽度   
                    align：设置这一列对齐的方式 
                
            -->
        <el-table style="margin: 10px 0px;" border :data="trademarkArr">
            <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
            <el-table-column label="品牌名称">
                <template #="{ row, $index }">
                    <pre style="color:brown">{{ row.tmName }}</pre>
                </template>
            </el-table-column>
            <el-table-column label="品牌LOGO">
                <template #="{ row, $index }">
                    <img :src="row.logoUrl" alt="图片获取失败" style="width:100px;height:100px;">
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="Edit" @click="$event => updateTrademark(row)"></el-button>
                    <el-popconfirm :title="`您确定要删除品牌吗${row.tmName}`" width="250px" @confirm='removeTradeMark(row.id)'>
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--
        分页器组件：
            v-model:current-page:设置分页器当前页码
            v-model:page-size:每页显示个数(也就是展示多少条)
            page-sizes:每一页显示个数选择器的选项设置
            small:是否使用小型分页器
            background:是否为分页器按钮添加背景颜色
            layout:可以设置分页器六个子组件布局的调整
    -->

        <el-pagination @size-change="sizeChange" @current-change="getHasTrademark" :pager-count="9"
            v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
            layout="prev, pager, next, jumper,->,sizes,total" :total="total" />
    </el-card>
    <!--对话框组件：添加和修改已有业务时候使用的结构-->
    <!--
        v-model用于控制对话框的显示与隐藏
        title：控制对话框的标题
    -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
        <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
            <el-form-item label="品牌名称" label-width="80px" prop="tmName">
                <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌logo" label-width="80px" prop="logoUrl">
                <!--
                    upload组件相应属性
                        action:请求URL,要在路径上面写上api/否则上传不了
                        :show-file-list:展示上传文件的名字
                        :before-upload:在图片上传之前触发，可以约束文件类型和大小
                -->
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <!--具名插槽：footer-->
        <template #footer>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
            <el-button type="primary" size="default" @click="confirm">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, UploadProps } from 'element-plus'
import { onMounted, ref, watch, reactive, nextTick } from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from "@/api/product/trademark"
//引入ts类型
import type { Records, TradeMarkResponseData, Trademark } from '@/api/product/trademark/type'
//当前页码
let pageNo = ref<number>(1);
//每一页展示多少数据
let limit = ref<number>(3)
//存储已有品牌数量的总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
//控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//定义收集新增品牌数据
let trademarkParams = reactive<Trademark>({
    tmName: '',
    logoUrl: ''
})

//获取el-from组件实例
let formRef = ref()

//获取已有品牌的接口
const getHasTrademark = async (pager = 1) => {
    pageNo.value = pager
    let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    if (result.code == 200) {
        total.value = result.data.total
        trademarkArr.value = result.data.records
    }
}
//组件挂载完毕钩子----发一次钩子，获取第一页，一夜三个已有品牌数据
onMounted(() => {
    getHasTrademark()
});
//分页器当前页码发生变化的时候会触发
//对于当前页码发生变化的时候触发自定义事件，组件pagination父组件回传了数据(当前页码)
// const changePageNo=()=>{
//     //当前页码发生变化的时候，再次发请求获取对应的已有品牌的数据
//     getHasTrademark()
// }
//当下拉菜单发生变化的时候触发方法
const sizeChange = () => {
    //当前页码发生变化的时候，当前页码归一
    //pageNo.value=1
    getHasTrademark()
}
//监听limit，一旦变化，调用函数，并且将页码置为1
// watch([limit],()=>{
//     getHasTrademark()
// })

//添加品牌按钮的回调
const addTrademark = () => {
    dialogFormVisible.value = true
    //清空输入的数据
    trademarkParams.tmName = ''
    trademarkParams.logoUrl = ''
    trademarkParams.id = 0
    //第一种方法，ts问号语法
    // formRef.value?.clearValidate(['tmName','logoUrl'])
    nextTick(() => {
        formRef.value.clearValidate(['tmName', 'logoUrl'])
    })
}
//修改已有品牌的回调
//row是当前已有的品牌
const updateTrademark = (row) => {
    dialogFormVisible.value = true
    //es6合并对象方法
    Object.assign(trademarkParams, row)
    // trademarkParams.id=row.id
    // //展示已有品牌
    // trademarkParams.tmName = row.tmName
    // trademarkParams.logoUrl = row.logoUrl
    nextTick(() => {
        formRef.value.clearValidate(['tmName', 'logoUrl'])
    })
}
//对话框底部取消按钮
const cancel = () => {
    dialogFormVisible.value = false
}
//对话框底部确认按钮
const confirm = async () => {
    //再发请求之前，对整个表单进行校验
    //调用这个方法进行全部表单项的校验
    await formRef.value.validate()
    let result: any = await reqAddOrUpdateTrademark(trademarkParams)
    //添加品牌成功|修改品牌成功
    if (result.code == 200) {
        dialogFormVisible.value = false
        ElMessage({
            type: 'success',
            message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
        })
        //再次发请求，获取全部品牌的数据
        getHasTrademark(trademarkParams.id ? pageNo.value : 1)

    } else {
        //添加品牌失败
        dialogFormVisible.value = false
        ElMessage({
            type: 'error',
            message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
        })
    }

    //dialogFormVisible.value = false
}

//上传图片组件之上传组件之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    //在图片上传之前触发，可以约束文件类型和大小
    //我们要求只能上传|png|jpg|gif 4M
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: "上传图片大小小于应为4M"
            })
        }
    } else {
        ElMessage({
            type: 'error',
            message: "上传格式应为图片"
        })
        return false
    }
}
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    //response:即为当前这次上传图潘post请求服务器返回的数据
    //收集上传图片的地址，添加一个新的品牌带给服务器
    trademarkParams.logoUrl = response.data
    //图片上传成功，清除图片对应图片校验结果
    formRef.value.clearValidate('logoUrl')
}
//品牌自定义校验方法
const validatorTmName = (rule: any, value: any, callback: any) => {
    //自定义校验规则
    //当表单元素触发blur时会触发此方法
    //value:表单元素文本内容
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('品牌名称位数应大于等于两位'))
    }
}
//校验LOGO品牌的方法
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
    //如果图片上传
    console.log(value);

    if (value) {
        callback()
    } else {
        callback(new Error('图片必须上传'))
    }
}
//气泡框的方法
const removeTradeMark = async (id: number) => {
    //点击确定按钮时删除已有的请求

    let result: any = await reqDeleteTrademark(id)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除品牌成功'
        })
        getHasTrademark(trademarkArr.value.length>1?pageNo.value:pageNo.value-1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除品牌失败'
        })
    }
    //点击之后需要再次请求一下

}
//表单校验规则
const rules = {
    tmName: [
        //required代表这个字段务必要检验
        //trigger:代表出发校验规则的时机,blur:失去焦点,change:文本改变
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [
        { required: true, trigger: 'change', validator: validatorLogoUrl }
    ]
}

</script>
<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>