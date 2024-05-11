<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="SPU名称">
                <el-input placeholder="请你输入spu名称" v-model="SpuParams.spuName"></el-input>
            </el-form-item>
            <el-form-item label="SPU品牌">
                <el-select v-model="SpuParams.tmId">
                    <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :label="item.tmName"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type="textarea" placeholder="请你输入spu描述" v-model="SpuParams.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <!--
                    v-model:fileList:用于展示已有的图片数据
                    action:上传图片的接口地址
                    list-type:文件列表的类型
                    on-preview：点击文件列表中已上传的钩子
                -->
                <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handleUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>

                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="SPU销售属性">
                <el-select v-model="saleAttrIdAndValueName"
                    :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : `无`">
                    <el-option :value="`${item.id}:${item.name}`" v-for="(item, index) in unSelectSaleAttr" :key="item.id"
                        :label="item.name"></el-option>
                </el-select>
                <el-button :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px;" type="primary"
                    size="default" icon="Plus" @click="addSaleAttr">添加属性</el-button>
                <!--table展示销售属性和销售值的地方-->
                <el-table border style="margin: 10px 0px;" :data="saleAttr">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                    <el-table-column label="属性值">
                        <!--
                            row:即为当前spu销售属性对象
                        -->
                        <template #="{ row, $index }">
                            <el-tag @close="row.spuSaleAttrValueList.splice($index, 1)" style="margin:0px 5px"
                                v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable>
                                {{ item.saleAttrValueName }}
                            </el-tag>
                            <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true"
                                placeholder="请你输入属性值" size="small" style="width:100px"></el-input>
                            <el-button v-else type="primary" size="small" icon="plus" @click="toEdit(row)"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Delete" color="red"
                                @click="saleAttr.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default"
                    @click="save">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu/index'
import type { SaleAttrValue, SpuData, HasSaleAttr, SaleAttr, SpuImg, Trademark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus';
import { ref, computed } from 'vue';
let $emit = defineEmits(['changeScene'])
//子组件点击取消按钮，通知父组件切换场景为1，切换为SPU展示
const cancel = () => {
    $emit('changeScene', {flag:0,params:'update'})
}
//存储已有的spu的数据
let AllTradeMark = ref<Trademark[]>([])
//商品图片
let imgList = ref<SpuImg[]>([])
//已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//定义一个数组接收已有的SPU对象
let SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    description: "",//SPU描述
    spuName: "",//spu名字
    tmId: "",//品牌ID
    spuImageList: [
    ],
    spuSaleAttrList: [
    ],

})
//将来收集还未选择的销售属性和ID
let saleAttrIdAndValueName = ref<string>('')
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//存储预览图片的地址
let dialogImageUrl = ref<string>('')
//子组件书写方法
const initHasSpuData = async (spu: SpuData) => {
    //存储已有SPU对象
    SpuParams.value = spu
    //spu：是父组件传递过来的已有的spu对象，但不完整
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark()
    //获取某一个品牌旗下全部售卖商品的图片
    let result1: SpuHasImg = await reqSpuImageList((spu.id as number))
    //获取已有的SPU销售属性的数据
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number))
    //获取全部的SPU销售属性
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
    //存储全部品牌的数据
    AllTradeMark.value = result.data
    //全部的SPU对应的商品图片
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    //存储已有的spu的销售属性
    saleAttr.value = result2.data
    //存储所有的销售属性
    allSaleAttr.value = result3.data
}
//照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
    //预览图地址
    dialogImageUrl.value = file.url
    //弹出对话框
    dialogVisible.value = true
}
//照片墙删除文件的钩子
const handleRemove = () => {
    console.log(123);
}
//照片墙上传成功之前的钩子,约束文件的大小和类型
const handleUpload = (file: any) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: '上传文佳务必小于3M'
            })
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文佳务必是图片格式'
        })
    }
}
//计算出当前SPU没有的销售属性
let unSelectSaleAttr = computed(() => {
    //当前全部的销售属性：颜色版本尺码
    //已有的销售属性：颜色，版本
    let unSelectAttr = allSaleAttr.value.filter(item => {
        return saleAttr.value.every(item1 => {
            return item.name != item1.saleAttrName
        })
    })
    return unSelectAttr
})
//添加属性的方法
const addSaleAttr = () => {

    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //追加到数组里面
    saleAttr.value.push(newSaleAttr)
    //清空收集的数据
    saleAttrIdAndValueName.value = ''
}
//属性按钮点击回调
const toEdit = (row: SaleAttr) => {
    row.flag = true
    row.saleAttrValue = ''


}
//表单元素失去焦点的回调
const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row
    //非法情况判断
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        return
    }
    //判断属性值是否存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue
    })
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return
    }
    //整理成服务器需要的形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    //切换为查看模式
    row.flag = false
}

const save = async () => {
    //整理参数
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,//图片名字
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    //2：整理销售属性的数据
    SpuParams.value.spuSaleAttrList = saleAttr.value
    let result = await reqAddOrUpdateSpu(SpuParams.value)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        $emit('changeScene', {flag:0,params:SpuParams.value.id?'update':'add'})
    } else {
        ElMessage({
            type: 'error',
            message: SpuParams.value.id ? '更新失败' : '添加失败'
        })
    }
    //发请求：添加或更新
}
const initAddSpu = async (c3Id: number | string) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        description: "",//SPU描述
        spuName: "",//spu名字
        tmId: "",//品牌ID
        spuImageList: [
        ],
        spuSaleAttrList: [
        ],
    })
    //清空照片
    imgList.value=[]
    //清空销售属性
    saleAttr.value=[]
    //清空收集的数据
    saleAttrIdAndValueName.value=''
    //清空id
    SpuParams.value.id=0
//==============================================================
    //存储三级分类的ID
    SpuParams.value.category3Id = c3Id
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark()
    let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
    //存储数据
    AllTradeMark.value = result.data
    allSaleAttr.value = result1.data
    console.log('添加SPU');

}
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>