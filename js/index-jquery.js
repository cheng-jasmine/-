var tableData = [];
var currentPage = 1;
var totalPage = 1;
var pageSize = 5;

//获取学生数据
function getTableData() {
    /*$.ajax({
        url: "http://open.duyiedu.com/api/student/findAll",
        type: 'get',
        data: {
            appkey: 'Jasmine_1603453921876'
        },
        dataType: 'json',
        success: function (res) {
            console.log(res);
            tableData = res.data;
            //渲染表格数据
            renderTable(res.data);
        }
    }) */
    transferData('api/student/findByPage', {
        page: currentPage,
        size: pageSize
    }, function (data) {
            console.log(data);
            totalPage = Math.ceil(data.cont / pageSize);
            tableData = data.findByPage;
            //渲染表格数据
            renderTable(tableData);
    })
}

//渲染表格数据
function renderTable(data) {
    var str = data.reduce(function (prev, item) {
        return prev + `<tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == 0 ? '男': '女'}</td>
        <td>${item.email}</td>
        <td>${new Date().getFullYear() - item.birth}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <button class="btn edit">编辑</button>
            <button class="btn remove">删除</button>
        </td>
    </tr>`;
    }, '');
    $('#student-body').html(str);
    $('.page').page({
        current: currentPage,
        total: totalPage,
        change: function (page) {
            currentPage = page;
            getTableData();
        }
    });
}

getTableData();

//所有绑定事件函数
function bindEvent() {
    //编辑和删除按钮的功能
    $('#student-body').on('click', '.btn', function () {
        //获取点击的这一行的学生数据
        var index = $(this).parents('tr').index();
        //区分编辑和删除按钮
        if ($(this).hasClass('edit')) {
            //编辑按钮
            $('.dialog').slideDown();
            renderEditForm(tableData[index]);
        } else if ($(this).hasClass('remove')) {
            //删除按钮
            var isDel = confirm('确认删除学号为' + tableData[index].sNo + '的学生信息吗？');
            if (isDel) {
                transferData('api/student/delBySno', {
                    sNo: tableData[index].sNo
                }, function () {
                        alert('删除成功');
                        getTableData();
                })
            }
        }
    });
    //编辑表单的提交功能
    $('#edit-form-btn').click(function (e) {
        //form表单提交时会触发默认行为-刷新页面，阻止该行为
        e.preventDefault();
        //获取编辑表单里的数据，并将数据转换成数组类型
        var data = $('#student-edit-form').serializeArray();
        var result = validForm(data);
        //校验成功
        if (result.status === 'success') {
            transferData('api/student/updateStudent', result.data, function (data) {
                alert('提交成功');
                $('.dialog').slideUp();
                getTableData();//重新获取数据
            })
        } else {
            //校验失败
            alert(result.msg);
        }
    });
    //切换到新增学生页面
    $('.left-menu').on('click', 'dd', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var id = $(this).data('id');
        $('#' + id).fadeIn().siblings().fadeOut();
    });
    //新增学生页面的提交功能
    $('#add-form-btn').click(function (e) {
        e.preventDefault();//阻止提交表单的默认事件-刷新页面
        var data = $('#student-add-form').serializeArray();
        var result = validForm(data);
        //校验成功
        if (result.status === 'success') {
            transferData('api/student/addStudent', result.data, function (data) {
                alert('提交成功');
                $('.left-menu dd[data-id=student-list]').trigger('click');
                $('#student-add-form')[0].reset();
                getTableData();//重新获取数据
            })
        } else {
            //校验失败
            alert(result.msg);
        }
    });
    //点击编辑表单灰色区域时，弹窗消失
    $('.dialog').click(function (e) {
        if (e.target === this) {
            $('.dialog').slideUp();
        }
    })
}

//编辑表单的数据回填
function renderEditForm(data) {
    var form = $('#student-edit-form')[0];
    //遍历当前学生的信息，判断表单里是否又填写该数据的位置，如果有则设置
    for (var prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}

//表单规则校验
function validForm(arr) {
    //当前学生的信息
    var obj = {};
    //校验之前的结果数据
    var result = {
        //校验之后的信息
        msg: '',
        //校验之后的数据
        data: {},
        //校验之后的结果如果全部符合规则，那么值为success，否则值为fail
        status: 'success'
    };
    //遍历传递过来的表单数据
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i].name] = arr[i].value;
        if (!arr[i].name && arr[i].value !== 0) {
            result.msg = '信息填写不全，请校验之后提交';
            result.status = "fail";
            return result;
        }
    }
    //校验邮箱
    var emailReg = /^[\w\.-_]+@[\w-_]+\.(com|cn)$/;
    if (!emailReg.test(obj.email)) {
        result.msg = '邮箱格式不正确';
        result.status = 'fail';
        return result;
    }
    //校验学号
    var sNoReg = /^\d{4,16}$/;
    if (!sNoReg.test(obj.sNo)) {
        result.msg = '学号应为4-16位的有效数字';
        result.status = 'fail';
        return result;
    }
    //校验手机号
    var phoneReg = /^1[13-9]\d{9}$/;
    if (!phoneReg.test(obj.phone)) {
        result.msg = '手机号格式不正确';
        result.status = 'fail';
        return result;
    }
    //校验出生年份
    if (obj.birth < 1970 || obj.birth >= 2020) {
        result.msg = '出生年份不正确';
        result.status = 'fail';
        return result;
    }
    //如果全部校验成功，则将数据添加到返回值当中
    result.data = obj;
    return result;
}

//数据交互函数
function transferData(url, data, success) {
    $.ajax({
        url: "http://open.duyiedu.com/" + url,
        type: 'get',
        data: $.extend({
            appkey: 'Jasmine_1603453921876'
        }, data),
        dataType: 'json',
        success: function (res) {
            //判断后台给我们的数据是否正确
            if (res.status === 'success') {
                success(res.data);
            } else {
                //如果后台没有正常返回数据，则抛出错误信息
                alert(res.msg);
            }
        }
    })
}

bindEvent();

//用户登陆状态校验
// var userData = sessionStorage.getItem('studentMessageId');
// $.ajax({
//     url: 'http://open.duyiedu.com/api/student/stuLogin',
//     type: 'POST',
//     data: userData,
//     dataType: 'json',
//     success: function (res) {
//         console.log(res);
//         if (res.status === 'fail') {
//             //如果用户信息校验不正确，不显示系统
//             location.href = './login.html';
//         } else {
//             getTableData();
//             bindEvent();
//         }
//     }
// });