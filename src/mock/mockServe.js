//先引入mockjs模块
import Mock from 'mockjs';
//把JSON数据格式引入进来[JSON数据格式根本没有对外暴露，但是可以引入]
//webpack默认对外暴露的：图片、JSON数据格式
import banner from './banner.json';
import floor from './floor.json';
import basecategorylist from './basecategorylist.json'
import searchinfo from './searchinfo.json'
import goodsinfo from './goodsinfo.json'
import addressinfo from './addressinfo.json'
import myorder from './myorder.json'
import md5 from 'js-md5'

function getParamsFromUrl(url, baseUrl) {
    return url.replace(baseUrl, '').split('/');
}

//mock数据:第一个参数请求地址   第二个参数：请求数据
Mock.mock("/mock/banner", {
    code: 200,
    data: banner
}); //模拟首页大的轮播图的数据
Mock.mock("/mock/floor", {
    code: 200,
    data: floor
});
Mock.mock("/mock/product/getBaseCategoryList", {
    code: 200,
    data: basecategorylist
});
Mock.mock("/mock/list", (data) => {
    let params = JSON.parse(data.body);
    searchinfo.pageSize = params.pageSize;
    searchinfo.pageNo = params.pageNo;
    searchinfo.goodsList = [];
    for (let i = 0; i < searchinfo.pageSize; i++) {
        searchinfo.goodsList.push({
            "id": Mock.Random.increment(),
            "defaultImg": Mock.Random.dataImage('616x616', Mock.Random.word()),
            "title": Mock.Random.sentence(5, 8),
            "price": Mock.Random.integer(0, 10000),
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
    return {
        code: 200,
        data: searchinfo
    };
});

Mock.mock(/\/mock\/item/, 'get', {
    code: 200,
    data: goodsinfo
})


let mockCartList = new Map();
let mockCartChecked = new Map();
Mock.mock(/\/cart\/addToCart/, 'post', (options) => {
    let {
        skuId,
        skuNum
    } = JSON.parse(options.body);
    mockCartList.set(skuId, (mockCartList.has(skuId) ? mockCartList.get(skuId) : 0) + skuNum);
    mockCartChecked.set(skuId, 1);
    return {
        code: 200
    };
});
Mock.mock('/mock/cart/cartList', 'get', () => {
    let cartList = {
        cartInfoList: []
    }

    for (let key of mockCartList.keys()) {
        cartList.cartInfoList.push({
            id: Mock.Random.increment(),
            isChecked: mockCartChecked.get(key),
            imgUrl: Mock.Random.dataImage('616x616'),
            skuName: Mock.Random.csentence(),
            skuPrice: Mock.Random.integer(100, 10000),
            skuNum: mockCartList.get(key),
            skuId: key
        })
    }

    return {
        code: 200,
        data: [cartList]
    };
});
Mock.mock(/\/cart\/deleteCart/, 'delete', (options) => {
    // let params = options.url.replace('/mock/cart/deleteCart/','').split('/');
    let [skuId] = getParamsFromUrl(options.url, '/mock/cart/deleteCart/');

    mockCartList.delete(skuId);
    mockCartChecked.delete(skuId);

    return {
        code: 200
    };
})

Mock.mock(/\/cart\/checkCart/, 'get', (options) => {
    // let params = options.url.replace('/mock/cart/checkCart/','').split('/');
    let [skuId, isChecked] = getParamsFromUrl(options.url, '/mock/cart/checkCart/');
    // console.log(skuId,isChecked);
    mockCartChecked.set(skuId, isChecked);
    return {
        code: 200
    };
})


let users = new Map();
users.set('15810395998', '12345678');
let sentCode;
let sentToken;
Mock.mock(/\/user\/passport\/sendCode/, 'get', (options) => {
    let [phone] = getParamsFromUrl(options.url, '/mock/user/passport/sendCode/');
    sentCode = Mock.Random.integer(100000, 999999);
    return {
        code: 200,
        data: sentCode
    };
});

Mock.mock('/mock/user/passport/register', (options) => {
    let {
        phone,
        code,
        password
    } = JSON.parse(options.body);
    if (users.has(phone) || code != sentCode) {
        return {
            code: 400
        };
    } else {
        users.set(phone, password);
        return {
            code: 200
        };
    }
})

Mock.mock('/mock/user/passport/login', (options) => {
    let {
        phone,
        password
    } = JSON.parse(options.body);
    if (users.has(phone) && password == users.get(phone)) {
        sentToken = md5(Mock.Random.integer(1, 100) + phone);
        return {
            code: 200,
            data: {
                token: sentToken
            }
        };
    } else {
        return {
            code: 400
        };
    }
})

Mock.mock('/mock/user/passport/auth/getUserInfo', {
    code: 200,
    data: {
        name: Mock.Random.cword(4, 6),
        token: sentToken
    }
})

Mock.mock('/mock/user/passport/logout', () => {
    return {
        code: 200
    };
})

Mock.mock('/mock/user/userAddress/auth/findUserAddressList', {
    code: 200,
    data: addressinfo
})

Mock.mock('/mock/order/auth/trade', () => {
    let orderInfo = {
        detailArrayList: [],
        totalNum: 0,
        totalAmount: 0,
        tradeNo: md5(Mock.Random.integer(1, 100).toString())
    }

    for (let key of mockCartList.keys()) {
        if (mockCartChecked.get(key) == 1) {
            let temp = {
                skuId: key,
                imgUrl: Mock.Random.dataImage('616x616'),
                skuName: Mock.Random.cword(6, 8),
                skuNum: mockCartList.get(key),
                orderPrice: Mock.Random.integer(100, 10000),
            }
            orderInfo.detailArrayList.push(temp);
            orderInfo.totalNum += temp.skuNum;
            orderInfo.totalAmount += temp.orderPrice * temp.skuNum;
        }
    }
    return {
        code: 200,
        data: orderInfo
    };
})

Mock.mock(/\/order\/auth\/submitOrder/, {
    code: 200,
    data: 10086
});

Mock.mock(/\/payment\/weixin\/createNative/, {
    code: 200,
    data: {
        totalFee:Mock.Random.integer(100,10000),
        codeUrl:'www.baidu.com'
    }
})

Mock.mock(/\/payment\/weixin\/queryPayStatus/, {
    code:200
})

Mock.mock('/mock/order/auth/', {
    code:200,
    data:myorder
})