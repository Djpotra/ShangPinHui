//先引入mockjs模块
import Mock from 'mockjs';
//把JSON数据格式引入进来[JSON数据格式根本没有对外暴露，但是可以引入]
//webpack默认对外暴露的：图片、JSON数据格式
import banner from './banner.json';
import floor from './floor.json';
import basecategorylist from './basecategorylist.json'
import searchinfo from './searchinfo.json'
import goodsinfo from './goodsinfo.json'
import { options } from 'less';

//mock数据:第一个参数请求地址   第二个参数：请求数据
Mock.mock("/mock/banner", { code: 200, data: banner });//模拟首页大的轮播图的数据
Mock.mock("/mock/floor", { code: 200, data: floor });
Mock.mock("/mock/product/getBaseCategoryList", { code: 200, data: basecategorylist });
Mock.mock("/mock/list", (data) => {
    let params = JSON.parse(data.body);
    searchinfo.pageSize = params.pageSize;
    searchinfo.pageNo = params.pageNo;
    searchinfo.goodsList = [];
    for(let i=0;i<searchinfo.pageSize;i++){
        searchinfo.goodsList.push({
            "id": Mock.Random.increment(),
            "defaultImg":Mock.Random.dataImage('616x616',Mock.Random.word()),
            "title": Mock.Random.sentence(5,8),
            "price": Mock.Random.integer(0,10000),
            "createTime": null,
            "tmId": null,
            "tmName": null,
            "tmLogoUrl": null,
            "category1Id": null,
            "category1Name": null,
            "category2Id": null,
            "category2Name": null,
            "category3Id": null,
            "category3Name": null,
            "hotScore": 0,
            "attrs": null
        });
    }
    return { code: 200, data: searchinfo };
});

Mock.mock(/\/mock\/item/,'get',{code:200,data:goodsinfo})

let mockCartList = new Map();
let mockCartChecked = new Map();

Mock.mock(/\/cart\/addToCart/,'post',(options)=>{
    let {skuId,skuNum} = JSON.parse(options.body);
    mockCartList.set(skuId,(mockCartList.has(skuId) ? mockCartList.get(skuId) : 0) + skuNum);
    mockCartChecked.set(skuId,1);
    return {code:200};
});

Mock.mock('/mock/cart/cartList','get',()=>{
    let cartList = {
        cartInfoList:[]
    }

    for(let key of mockCartList.keys()){
        cartList.cartInfoList.push({
            id:Mock.Random.increment(),
            isChecked:mockCartChecked.get(key),
            imgUrl:Mock.Random.dataImage('616x616'),
            skuName:Mock.Random.csentence(),
            skuPrice:Mock.Random.integer(100,10000),
            skuNum:mockCartList.get(key),
            skuId:key
        })
    }

    return {code:200,data:[cartList]};
});

Mock.mock(/\/cart\/deleteCart/,'delete',(options)=>{
    console.log(options);
    for(let i=0;i<mockCartList.length;i++){
        
    }
})

Mock.mock(/\/cart\/checkCart/,'get',(options)=>{

})

Mock.mock(/\/user\/passport\/sendCode/,'get',(options)=>{

})

let users = new Map();
Mock.mock('/user/passport/register',(options)=>{

})

Mock.mock('/user/passport/login',(options)=>{

})

Mock.mock('/user/passport/auth/getUserInfo',()=>{

})

Mock.mock('/user/passport/logout',()=>{

})

Mock.mock('/user/userAddress/auth/findUserAddressList',()=>{

})

Mock.mock('/order/auth/trade',()=>{

})

Mock.mock(/\/order\/auth\/submitOrder/,()=>{

})

Mock.mock(/\/payment\/weixin\/createNative/,()=>{

})

Mock.mock(/\/payment\/weixin\/queryPayStatus/,()=>{

})

Mock.mock(/\/order\/auth/,()=>{
    
})

