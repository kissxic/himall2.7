﻿$(function () {
    query();
    $("#searchBtn").click(function () { query(); });
    AutoComplete();
})
$(function () {
    $("#inputStartDateLogin,#inputStartDate").datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        autoclose: true,
        weekStart: 1,
        minView: 2
    });
    $("#inputEndDateLogin,#inputEndDate").datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        autoclose: true,
        weekStart: 1,
        minView: 2
    });

    $("#inputStartDate").on('changeDate', function () {
        if ($("#inputEndDate").val()) {
            if ($("#inputStartDate").val() > $("#inputEndDate").val()) {
                $("#inputEndDate").val($("#inputStartDate").val());
            }
        }
        $("#inputEndDate").datetimepicker('setStartDate', $("#inputStartDate").val());
    });
    $("#inputStartDateLogin").on('changeDate', function () {
        if ($("#inputEndDateLogin").val()) {
            if ($("#inputStartDateLogin").val() > $("#inputEndDateLogin").val()) {
                $("#inputEndDateLogin").val($("#inputStartDateLogin").val());
            }
        }

        $("#inputEndDateLogin").datetimepicker('setStartDate', $("#inputStartDateLogin").val());
    });
    $('#btnAdvanceSearch').click(function () {
        $('#divAdvanceSearch').toggle();

        if ($(this).hasClass('menu-shrink')) {
            $(this).removeClass("menu-shrink").addClass("up-shrink")
        } else {
            $(this).addClass("menu-shrink").removeClass("up-shrink")
        }
    });
});
function Delete(id) {
    $.dialog.confirm('确定删除该用户吗？', function () {
        var loading = showLoading();
        $.post("./Delete", { id: id }, function (data) { $.dialog.tips(data.msg); query(); loading.close(); });
    });
}
function Lock(id) {
    $.dialog.confirm('冻结之后，会员将不能登录商城，您确定冻结？', function () {
        var loading = showLoading();
        $.post("./Lock", { id: id }, function (data) { $.dialog.tips(data.msg); query(); loading.close(); });
    });
}
function UnLock(id) {
    $.dialog.confirm('确定重新激活该用户吗？', function () {
        var loading = showLoading();
        $.post("./UnLock", { id: id }, function (data) { $.dialog.tips(data.msg); query(); loading.close(); });
    });
}

function BatchLock() {
    var selectedRows = $("#list").hiMallDatagrid("getSelections");


    if (selectedRows.length == 0) {
        $.dialog.tips("你没有选择任何选项！");
    }
    else {
        var selectids = new Array();
        for (var i = 0; i < selectedRows.length; i++) {
            selectids.push(selectedRows[i].Id);
        }
        $.dialog.confirm('确定冻结选择的用户吗？', function () {
            var loading = showLoading();
            $.post("./BatchLock", { ids: selectids.join(',') }, function (data) { $.dialog.tips(data.msg); query(); loading.close(); });
        });
    }
}
$(function () {
    $("#divSetLabel .form-group").css({ "width": "150px", "float": "left", "border": "none", "white-space": "nowrap", "overflow": "hidden", "margin": "10px" });
});

function Show(id) {
    var str = '';
    var loading = showLoading();
    $.ajax({
        type: "post",
        async: true,
        dataType: "html",
        url: '/Admin/member/Detail',
        data: { Id: id },
        success: function (data) {
            str = data;
            $.dialog({
                title: '会员信息',
                lock: true,
                id: 'ChangePwd',
                width: '400px',
                content: str,
                padding: '0 40px',
                okVal: '确定',
                ok: function () {
                }
            });
            loading.close();
        }
    });
}
function BatchDelete() {
    var selectedRows = $("#list").hiMallDatagrid("getSelections");
    var selectids = new Array();

    for (var i = 0; i < selectedRows.length; i++) {
        selectids.push(selectedRows[i].Id);
    }
    if (selectedRows.length == 0) {
        $.dialog.tips("你没有选择任何选项！");
    }
    else {
        $.dialog.confirm('确定删除选择的用户吗？', function () {
            var loading = showLoading();
            $.post("./BatchDelete", { ids: selectids.join(',') }, function (data) { $.dialog.tips(data.msg); query(); loading.close(); });
        });
    }
}

function query() {
    var rtstart, rtend, ltstart, ltend, isseller, isfocus, labelid;
    if ($('#divAdvanceSearch').css('display') != 'none') {
        rtstart = $("#inputStartDate").val();
        rtend = $("#inputEndDate").val();
        ltstart = $("#inputStartDateLogin").val();
        ltend = $("#inputEndDateLogin").val();

        if ($('#sellerYes').get(0).checked || $('#sellerNo').get(0).checked) {
            isseller = $('#sellerYes').get(0).checked;
        }
        if ($('#focusYes').get(0).checked || $('#focusNo').get(0).checked) {
            isfocus = $('#focusYes').get(0).checked;
        }
    }
    if ($('#labelSelect').val() > 0) {
        labelid = $('#labelSelect').val();
    }
    var gradeId = $("#grade").val();
    var mobile = $("#mobile").val();
    var status = $("#status").val();
    var weChatNick = $("#weChatNick").val();

    $("#list").hiMallDatagrid({
        url: './managementList',
        nowrap: false,
        rownumbers: true,
        NoDataMsg: '没有找到符合条件的数据',
        border: false,
        fit: true,
        fitColumns: true,
        pagination: true,
        idField: "Id",
        pageSize: 10,
        pageNumber: 1,
        queryParams: {
            keyWords: $("#autoTextBox").val(), labelid: labelid, isSeller: isseller,
            isFocus: isfocus, regtimeStart: rtstart, regtimeEnd: rtend,
            gradeId: gradeId, mobile: mobile, weChatNick: weChatNick,
            status: status
        },
        toolbar: /*"#goods-datagrid-toolbar",*/'',
        operationButtons: "#batchOperate",
        columns:
        [[
            { checkbox: true, width: 39 },
            { field: "Id", hidden: true },
            { field: "UserName", title: '会员名' },
            { field: "BondMoney", title: '保证金' },
            {
                field: "MemberGradeId", title: '会员类型',
                formatter: function (value, row, index) {
                    var html = "";
                    if (row.MemberGradeId == 0)
                        html += '普通商家';
                    else if (row.MemberGradeId == 1)
                        html += '工长，设计师，装企';
                    else
                        html += '总经销';
                    return html;
                }
            },
            { field: "GradeName", title: '等级', width: 60 },
            { field: "AvailableIntegral", title: '积分', width: 30 },
            {
                field: "CreateDate", title: '创建日期',
                formatter: function (value, row, index) {
                    var d = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
                    var year = d.getFullYear();
                    var month = d.getMonth() + 1;
                    var date = d.getDate();
                    var hour = d.getHours();
                    var minute = d.getMinutes();
                    var second = d.getSeconds();
                    return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
                }

            },
            {
                field: "Disabled", title: '状态',
                formatter: function (value, row, index) {
                    var html = "";
                    if (row.Disabled)
                        html += '冻结';
                    else
                        html += '正常';
                    return html;
                }
            },
        {
            field: "operation", operation: true, title: "操作",
            formatter: function (value, row, index) {

                var id = row.Id.toString();
                var html = ["<span class=\"btn-a\">"];
                html.push("<a onclick=\"AddLabel('" + id + "');\">选择类型</a>");
                //html.push("<a href='MemberDetail/" + id + "'>查看</a>");

                html.push("</span>");
                return html.join("");
            }
        }
        ]]
    });
}

function AddLabel(memberid) {
    if ($('input[name=radio_Label]').length == 0) {
        $.dialog.alert('没有可添加的标签，请到标签管理添加！');
        return;
    }
    $.ajax({
        type: 'post',
        url: 'GetGradeTypeLabel',
        data: { Id: memberid },
        success: function (data) {
            $('input:radio[name="radio_Label"]').removeAttr('checked');
            $('input:radio[name="radio_bao"]').removeAttr('checked');
            //注意这里要用prop
            $("input[type=radio][name=radio_Label][value=" + data.MemberGradeId + "]").prop("checked", 'checked');
            $("input[type=radio][name=radio_bao][value=" + data.BondMoney + "]").prop("checked", 'checked');
            //$.each(data.Data, function (i, item) {
            //    $('#radio_' + item.LabelId).get(0).checked = true;
            //});
            $.dialog({
                title: '会员标签',
                lock: true,
                id: 'SetLabel',
                width: '630px',
                content: document.getElementById("divSetLabel"),
                padding: '10px 60px',
                okVal: '确定',
                ok: function () {
                    var bao = [];
                    $('input[name=radio_bao]').each(function (i, radio) {
                        if ($(radio).get(0).checked) {
                            bao.push($(radio).attr('value'));
                        }
                    });
                    var ids = [];
                    $('input[name=radio_Label]').each(function (i, radio) {
                        if ($(radio).get(0).checked) {
                            ids.push($(radio).attr('value'));
                        }
                    });
                    var loading = showLoading();
                    $.post('../Manager/update', { Id: memberid, MemberGradeId: ids.join(','), BondMoney: bao.join(',') }, function (result) {
                        if (result.Success) {
                            query();
                            $.dialog.tips('设置成功！');
                        }
                        loading.close();
                    });
                }
            });
        }
    });

}

function batchAddLabels() {
    var selecteds = $("#list").hiMallDatagrid('getSelections');
    var ids = [];
    $.each(selecteds, function () {
        ids.push(this.Id);
    });
    if (ids.length == 0) {
        $.dialog.tips('请选择会员！');
        return;
    }
    $('input[name=radio_Label]').each(function (i, checkbox) {
        $(checkbox).get(0).checked = false;
    });

    $.dialog({
        title: '会员标签',
        lock: true,
        id: 'SetLabel',
        width: '630px',
        content: document.getElementById("divSetLabel"),
        padding: '0 40px',
        okVal: '确定',
        ok: function () {
            var labelids = [];
            $('input[name=radio_Label]').each(function (i, checkbox) {
                if ($(checkbox).get(0).checked) {
                    labelids.push($(checkbox).attr('datavalue'));
                }
            });
            var loading = showLoading();
            $.post('SetMembersLabel', { ids: ids.join(','), labelids: labelids.join(',') }, function (result) {
                if (result.Success) {
                    query();
                    $.dialog.tips('设置成功！');
                }
                loading.close();
            });
        }
    });
}
function ChangePassWord(id) {
    var pwdreg = /^[^\s]{6,20}$/;

    $.dialog({
        title: '修改密码',
        lock: true,
        id: 'ChangePwd',
        content: document.getElementById("dialogform"),
        padding: '0 40px',
        okVal: '确定',
        init: function () { $("#password").focus(); },
        ok: function () {
            var passwpord = $("#password").val();
            if (!pwdreg.test(passwpord)) {
                $.dialog.errorTips("密码长度至少是6-20位,且不能包含空格！");
                return false;
            }
            var loading = showLoading();
            $.post("./ChangePassWord", { id: id, password: passwpord }, function (data) { $.dialog.tips(data.msg); $("#password").val(""); loading.close(); });
        }
    });

}

function AutoComplete() {
    //autocomplete
    $('#autoTextBox').autocomplete({
        source: function (query, process) {
            var matchCount = this.options.items;//返回结果集最大数量
            $.post("./getMembers", { "keyWords": $('#autoTextBox').val() }, function (respData) {
                return process(respData);
            });
        },
        formatItem: function (item) {
            return item.value;
        },
        setValue: function (item) {
            return { 'data-value': item.value, 'real-value': item.key };
        }
    });
}

function ExportExecl() {
    var rtstart, rtend, ltstart, ltend, isseller, isfocus, labelid;
    if ($('#divAdvanceSearch').css('display') != 'none') {
        rtstart = $("#inputStartDate").val();
        rtend = $("#inputEndDate").val();
        ltstart = $("#inputStartDateLogin").val();
        ltend = $("#inputEndDateLogin").val();
        if ($('#sellerYes').get(0).checked || $('#sellerNo').get(0).checked) {
            isseller = $('#sellerYes').get(0).checked;
        }
        if ($('#focusYes').get(0).checked || $('#focusNo').get(0).checked) {
            isfocus = $('#focusYes').get(0).checked;
        }
    }
    var status = $("#status").val();
    if ($('#labelSelect').val() > 0) {
        labelid = $('#labelSelect').val();
    }
    var gradeId = $("#grade").val();
    var mobile = $("#mobile").val();
    var weChatNick = $("#weChatNick").val();
    var href = "/Admin/Member/ExportToExcel?keyWords=" + $("#autoTextBox").val();
    if (labelid != "" && labelid != undefined)
        href += "&labelid=" + labelid;
    if (isseller) {
        href += "&isSeller=" + isseller;
    }
    if (isfocus) {
        href += "&isFocus=" + isfocus;
    }
    if (status != null && status != "")
        href += "&status=" + status;


    if (weChatNick && weChatNick.length > 0) {
        href += "&weChatNick=" + weChatNick;
    }
    if (gradeId != null && gradeId != "")
        href += "&gradeId=" + gradeId;
    if (mobile != null && mobile != "")
        href += "&mobile=" + mobile;
    if (rtstart != "" && rtstart != undefined)
        href += "&regtimeStart=" + rtstart;
    if (rtend != "" && rtend != undefined)
        href += "&regtimeEnd=" + rtend;
    if (ltstart != "" && ltstart != undefined)
        href += "&logintimeStart=" + ltstart;
    if (ltend != "" && ltend != undefined)
        href += "&logintimeEnd=" + ltend;
    $("#aExport").attr("href", href);
}