var tableData = [];

// 切换样式效果
function changeStyle(siblings, className, target) {
    for (var i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove(className);
    }
    target.classList.add(className);
}
function bindEvent() {   //绑定事件
    //选中class类名为left-menu的元素下的直接子元素 dl标签
    var menuDl = document.querySelector('.left-menu > dl');
    menuDl.onclick = function (e) {
        //判断当前点击元素是DD标签
        if (e.target.tagName === 'DD') {
            var siblings = getSiblings(e.target);
            changeStyle(siblings, 'active', e.target);
            //var id = e.target.getAttribute('data-id');
            var id = e.target.dataset.id;
            var content = document.getElementById(id);
            var contentSiblings = getSiblings(content);
            changeStyle(contentSiblings, 'show-content', content);
        }
    }
    var addSubmit = document.getElementById('add-form-btn');
    addSubmit.onclick = function (e) {
        e.preventDefault();
        var form = document.getElementById('student-add-form');
        var data = getFormData(form);
        //进行规则校验
        var isValid = isValidForm(data);
        //console.log(isValid);
        if (!isValid) {
            return false;
        }
        var dataStr = '';
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                dataStr += prop + '=' +data[prop] + "&";
            }
        }
        dataStr += 'appkey=Jasmine_1603453921876';
        ajax('GET', 'http://open.duyiedu.com/api/student/addStudent', dataStr, function (res) {
            if (res.status === 'success') {
                alert('新增成功');
                var studentListBtn = document.querySelector('.left-menu dl dd[data-id="student-list"]');
                studentListBtn.click();
                getTableData();
            }else {
                alert(res.msg);
            }
        }, true)
    }
    var tableBody = document.getElementById('student-body');
    var dialog = document.querySelector('.dialog');
    tableBody.onclick = function (e) {
        if (!e.target.classList.contains('btn')) {
            return false;
        }
        if (e.target.classList.contains('edit')) {
            //点击编辑按钮
            dialog.classList.add('show');
            var index = e.target.dataset.index;
            var student = tableData[index];
            dataReset(student);
        }else{
            //点击删除按钮
            var index = e.target.dataset.index;
            var student = tableData[index];
            var isDel = confirm('确认删除学号' + student.sNo + '的学生信息吗？');
            if (isDel) {
                ajax('GET', 'http://open.duyiedu.com/api/student/delBySno', 'appkey=Jasmine_1603453921876&sNo=' + student.sNo, function (res) {
                    //console.log(res)
                    if (res.status === 'success') {
                        alert('删除成功');
                        getTableData();
                    } else {
                        alert(res.msg);
                    }
                });
            }
        }
    }
    var editForm = document.getElementById('student-edit-form');
    var editSubmitBtn = document.getElementById('edit-form-btn');
    editSubmitBtn.onclick = function (e) {
        e.preventDefault();
        var data = getFormData(editForm);
        //进行规则校验
        var isValid = isValidForm(data);
        //console.log(isValid);
        if (!isValid) {
            return false;
        }
        var dataStr = '';
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                dataStr += prop + '=' +data[prop] + "&";
            }
        }
        dataStr += 'appkey=Jasmine_1603453921876';
        ajax('GET', 'http://open.duyiedu.com/api/student/updateStudent', dataStr, function (res) {
            if (res.status === 'success') {
                dialog.classList.remove('show');
                //window.location.reload();
                getTableData();
            }else {
                alert(res.msg);
            }
        }, true)
    }
    dialog.onclick = function (e) {
        if (e.target === this) {
            dialog.classList.remove('show');
        }
    }
}
//查找所有兄弟元素节点
function getSiblings(node) {
    var children = node.parentNode.children;
    var result = [];
    for (var i = 0; i < children.length; i++) {
        if (children[i] != node) {
            result.push(children[i]);
        }
    }
    return result;
}

//拿取表单当中所有数据
function getFormData(form) {
    return {
        name : form.name.value,
        sex : form.sex.value,
        email : form.email.value,
        sNo : form.sNo.value,
        birth : form.birth.value,
        phone : form.phone.value,
        address: form.address.value
    }
}

//表单的规则校验
function isValidForm(data) {
    var errorObj = {
        name: ["请填写学生姓名"],
        sNo: ["请填写学生学号", "学号由4-16位的数字组成"],
        birth: ["请填写出生年份", "仅接收50岁以内的学生"],
        email: ["请填写邮箱", "邮箱格式不正确"],
        sex: [],
        phone: ["请填写手机号", "手机号格式不正确"],
        address: ["请填写住址"]
    }
    for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
            // 判断当前属性是否有值， 如果没有则报出异常
            if (!data[prop]) {
                alert(errorObj[prop][0]);
                return false;
            }
        }
    }
    var regSNo = /^\d{4,16}$/;
    if (!regSNo.test(data.sNo)) {
        alert(errorObj.sNo[1]);
        return false;
    }
    return true;
}

//获取表格数据
function getTableData() {
    ajax('GET','http://open.duyiedu.com/api/student/findAll', 'appkey=Jasmine_1603453921876',function (res) {
        //console.log(res);
        if (res.status === 'success') {
            tableData = res.data;
            renderTable(res.data);
        }else {
            alert(res.msg);
        }
    })
}

//渲染表格信息
function renderTable(data) {
    var str = '';
    data.forEach(function (item, index) {
        str += `<tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == 0 ? '男': '女'}</td>
        <td>${item.email}</td>
        <td>${new Date().getFullYear() - item.birth}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <button class="btn edit" data-index=${index}>编辑</button>
            <button class="btn remove" data-index=${index}>删除</button>
        </td>
    </tr>`;
    })
    var tbody = document.getElementById('student-body');
    tbody.innerHTML = str;
}

//编辑表单的数据回填
function dataReset(data) {
    var form = document.getElementById('student-edit-form');
    //form.name.value = data.value;
    //console.log(data);
    //循环学生信息，判断在表单中是否含有输入的位置，如果有，修改其数据值
    for (var prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}

bindEvent();
getTableData();


/**
 * 
 * @param {String} method 请求方式  需要大写
 * @param {String} url    请求地址  协议（http）+ 域名+ 端口号 + 路径
 * @param {String} data   请求数据  key=value&key1=value1
 * @param {Function} cb     成功的回调函数
 * @param {Boolean} isAsync 是否异步 true
 */
function ajax(method, url, data, cb, isAsync) {
    console.log(data)
    // get   url + '?' + data
    // post 
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // xhr.readyState    1 - 4  监听是否有响应
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4) {
            if (xhr.status == 200) {
                cb(JSON.parse(xhr.responseText))
            }
        }
    }
    method = method.toUpperCase();
    if (method == 'GET') {
        xhr.open(method, url + '?' + data, isAsync);
        xhr.send();
    } else if (method == 'POST') {
        xhr.open(method, url, isAsync);
        // key=value&key1=valu1
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
}