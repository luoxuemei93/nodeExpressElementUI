var sqlMap = {
    user: {
        add: 'insert into usertable (userName,  password, userType,companyName, companyCode, companyAddress, orderCount, enabled) values (?,?,?,?,?,?,?,?)',
        select_name: 'select * from usertable',
        update_user: 'update usertable set',
        select_usercenter: 'select * from usertable',
    },
    reader: {
        add: 'insert into readerdata (id,date,name, province, city,address,zip,phone,card,email) values (?,?,?,?,?,?,?,?,?,?)',
        select_name: "select * from readerdata",
        selects_name: "select * from readerdata where id",
        update_reader: 'update readerdata set',
        delete:'delete from readerdata',
    },
    // 产品信息sql
    product: {
        add: 'insert into brandDB (pname, parentName) values (?,?)',
        batchadd: 'insert into brandDB (pname, parentName) values ?',
        selectClass: "select * from classtable",
        selectDetailClass: "select * from producttable where productClass1",
    },
    //订单信息
    order:{

    },
    // 订单明细
    orderDetail:{

    }
}

module.exports = sqlMap;
