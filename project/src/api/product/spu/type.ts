//服务器返回的接口类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//SPU数据的TS类型:到时候可以修改
export interface SpuData {
    category3Id: number | string,
    id?: number,
    spuName: string,
    tmId: number | string,
    description: string,
    spuSaleAttrList: null | SaleAttr[],
    spuImageList: null | SpuImg[],
}
//数组：元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}
//所有品牌数据的ts类型
export interface Trademark {
    id: number,
    tmName: string,
    logoUrl: string
}
//品牌接口返回的数据ts类型
export interface AllTradeMark extends ResponseData {
    data: Trademark[]
}
//商品图片的ts类型
export interface SpuImg {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    imgName?: string,
    imgUrl?: string,
    name?: string,
    url?: string
}
//已有的SPU的照片墙的数据类型
export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}
//已有销售属性值对象ts类型
export interface SaleAttrValue {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}
//存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[];
//销售属性对象的ts类型
export interface SaleAttr {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: SpuSaleAttrValueList,
    flag?: boolean,
    saleAttrValue?: string
}
//spu已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}
//已有的全部spu返回的数据ts类型
export interface HasSaleAttr {
    id: number,
    name: string,
}
export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}
//============================================================================

export interface Attr {
    attrId: string | number,
    valueId: string | number
}
export interface saleAttr {
    saleAttrId: string | number,
    saleAttrValueId: string | number
}
export interface SkuData {
    category3Id: string | number,
    spuId: string | number,
    tmId: string | number,
    skuName: string,
    price: string | number,
    weight: string | number,
    skuDesc: string,
    skuAttrValueList?: Attr[],
    skuSaleAttrValueList?: saleAttr[],
    skuDefaultImg: string
}
//获取SKU数据接口的数据类型
export interface SkuInfoData extends ResponseData{
    data:SkuData[]
}