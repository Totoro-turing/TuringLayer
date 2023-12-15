let distribut = 15
function recursion(s, e, zero, diffMonth){
    let sy = s.getFullYear();
    let ey = e.getFullYear();
    let sd = s.getDate();
    let ed = e.getDate();
    let em = e.getMonth();
    s.setMonth(s.getMonth() + 1);
    let sm = s.getMonth();
    let smm = new Date(sy, sm, 0).getDate()
    if(sm === em && ed <= distribut){
        if(sd === (distribut + 1) && ed === distribut){
            diffMonth += 1;
        }else{
            zero += smm - sd + 1;
            zero += ed;
        }
    }else if(sd === (distribut + 1)){
        diffMonth += 1;
        s.setDate(distribut + 1)
        return recursion(s, e, zero, diffMonth)
    }else{
        zero += smm - sd + 1;
        zero += distribut;
        s.setDate(distribut + 1)
        return recursion(s, e, zero, diffMonth)
    }
    return [zero, diffMonth];
}
function dateDiff(str, end){
    let s = new Date(str);
    let e = new Date(end);
    let sy = s.getFullYear();
    let ey = e.getFullYear();
    let sd = s.getDate();
    let ed = e.getDate();
    let sm = s.getMonth();
    let em = e.getMonth();
    //开始月份最后一天
    let smm = new Date(sy, sm, 0).getDate()
    // 2.19
    // 16 号上班当天开始计算工资
    // 用来存储零碎的天数
    let zero = 0;
    //计算相差月份  这个是整月 中间得
    let diffMonth = ey * 12 + em - sy * 12 - sm;
    //判断特殊情况
    let r = []
    if(diffMonth !== 0){
        if(ed > distribut){
            zero = zero + (ed - distribut);
            e.setDate(distribut)
        }
        if(sd <= distribut){
            zero = zero + (distribut - sd + 1);
            s.setDate(distribut + 1)
        }
        r = recursion(s, e, zero, 0)
        zero = r[0]
        diffMonth = r[1]
    }else{
        zero += (ed - sd + 1);
    }
    diffMonth += parseInt(zero / 30)
    return [diffMonth, zero % 30];
}
let $ = layui.jquery
function wages(dom){
    $(dom).val($(dom).val().replace(/[^\d]/g,''))
    if($(dom).val() === ""){
        $(dom).val(0)
    }else{
        $(dom).val(parseInt($(dom).val()))
    }
    let s = $(dom).parent().parent().next().find(".layui-input").eq(0).val()
    let e = $(dom).parent().parent().next().find(".layui-input").eq(1).val()
    if (s !== '' && e !== ''){
        let r = dateDiff(s, e)
        let m = parseInt($(dom).val())
        let d = Math.floor((m * r[0] + r[1] / 30 * m) * 10) / 10;
        $(dom).parent().parent().next().next().next().find(".layui-input").val(d)
        refreshEmpolyeeMoney()
    }

}

function refreshEmpolyeeMoney(){
    let amount = 0
    $(".layui-bg-blue").each(function () {
        amount += parseFloat($(this).val()) * 10
    })
    $(".layui-bg-green").eq(1).val(amount / 10 + "元")
}
layui.use(['form', 'layedit', 'laydate'], function(){
    let laydate = layui.laydate
    laydate.render({
        elem: '#rent-range' //开始时间和结束时间所在 input 框的父选择器
        //设置开始日期、日期日期的 input 选择器
        ,range: ['#startDate', '#endDate'] //数组格式为 layui 2.6.6 开始新增
    });
    let layer = layui.layer
    let index = 1;
    function commonRefresh(value, dom){
        let ds = value.split(" - ")
        l = dom
        if(ds[0] > ds[1]){
            layer.msg('开始时间不能大于结束时间', {icon: 6});
            l.parent().parent().parent().next().find('.layui-input').val("0月")
        }else{
            r = dateDiff(ds[0], ds[1])
            l.parent().parent().parent().next().find('.layui-input').val(r[0] + "月" + r[1] + "天")
            m = parseInt(l.parent().parent().parent().prev().find('.layui-input').val())
            e = Math.floor((m * r[0] + r[1] / 30 * m) * 10) / 10;
            l.parent().parent().parent().next().next().find('.layui-input').val(e)
            refreshEmpolyeeMoney()
        }
    }
    laydate.render({
        elem: '#work-range' //开始时间和结束时间所在 input 框的父选择器
        //设置开始日期、日期日期的 input 选择器
        ,range: ['#work-startDate', '#work-endDate'] //数组格式为 layui 2.6.6 开始新增
        ,done: function (value, date){
            commonRefresh(value, $("#work-startDate"))
        }
    });

    $("#add_work").on('click', function (){
        index += 1
        $("#account_1").append("<div class=\"layui-form-item\" id='employee-"+ index +"'>\n" +
            "        <div class=\"layui-inline\">\n" +
            "            <label class=\"layui-form-label\">司机</label>\n" +
            "            <div class=\"layui-input-inline\">\n" +
            "                <input type=\"tel\" name=\"phone\" lay-verify=\"required|phone\" placeholder=\"几个司机\" class=\"layui-input\" value = 1>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"layui-inline\">\n" +
            "            <label class=\"layui-form-label\">指挥</label>\n" +
            "            <div class=\"layui-input-inline\">\n" +
            "                <input type=\"text\" name=\"email\" lay-verify=\"email\" placeholder=\"几个指挥\" class=\"layui-input\" value = 1>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"layui-inline\">\n" +
            "            <label class=\"layui-form-label\">人工费</label>\n" +
            "            <div class=\"layui-input-inline\">\n" +
            "                <input type=\"text\" name=\"email\" lay-verify=\"email\" placeholder=\"单价/月\" onkeyup=\"wages(this)\" class=\"layui-input\" value = 0>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"layui-inline\">\n" +
            "            <label class=\"layui-form-label\">工作时间</label>\n" +
            "            <div class=\"layui-inline\" id='work-range-"+ index +"'>\n" +
            "                <div class=\"layui-input-inline\">\n" +
            "                    <input type=\"text\"  id='work-startDate-"+ index +"' class=\"layui-input\" placeholder=\"开始日期\">\n" +
            "                </div>\n" +
            "                <div class=\"layui-form-mid\">-</div>\n" +
            "                <div class=\"layui-input-inline\">\n" +
            "                    <input type=\"text\" id='work-endDate-"+ index +"' class=\"layui-input\" placeholder=\"结束日期\">\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"layui-inline\">\n" +
            "            <label class=\"layui-form-label\">在职时长</label>\n" +
            "            <div class=\"layui-input-inline\">\n" +
            "                <input type=\"text\" class=\"layui-input\" value = \"0月0天\" readonly>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"layui-inline\">\n" +
            "            <label class=\"layui-form-label\">人工</label>\n" +
            "            <div class=\"layui-input-inline\">\n" +
            "                <input type=\"text\"  placeholder=\"元\" class=\"layui-input layui-bg-blue\" readonly value = 0>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"layui-inline\" id = 'del_work_" + index + "'>\n" +
            "            <div class=\"layui-btn-container\">\n" +
            "                <button class=\"layui-btn layui-btn-primary layui-border-orange\">删除工作时间</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>"
        )
        $("#del_work_" + index).on('click', function (){
            $(this).parent().remove()
            refreshEmpolyeeMoney()
        })
        laydate.render({
            elem: '#work-range-' + index //开始时间和结束时间所在 input 框的父选择器
            //设置开始日期、日期日期的 input 选择器
            ,range: ['#work-startDate-' + index, '#work-endDate-' + index] //数组格式为 layui 2.6.6 开始新增
            ,done: function (value, date){
                l = $(this.elem[0]).find('input').eq(0)
                commonRefresh(value, l)
            }
        });
    })
})

