/**
 * 进程调度算法   2019/05/11更新 
 */
 var RP = 1;  //系统默认并发数为1
 var taskArr = []; //任务列表
 var rest_RAM = 100; //系统主存空间100KB
 var rest_TAP = 1;  //系统磁带机数1
 var current_time = 0; //当前时间
 var $runLog;; //调度过程日志
 /**
  * 任务列表 数据结构
  * name 名称
  * arrive_time 到达时间
  * run_time 预计运行时间
  * need_ram 需要内存大小
  * need_tap 需要磁带机数
  * state 任务状态{wait(等待), ready(就绪), run(运行), finish(完成)}
  */
 function getData() {
 	taskArr = [];
 	var name, arrive_time, run_time, need_ram, need_tap;
 	$('#table').find('tr').each(function(i){
         name = $(this).find('input[name=name]').val();
         arrive_time = $(this).find('input[name=arrive_time]').val() * 1;
         run_time = $(this).find('input[name=run_time]').val() * 1;
         need_ram = $(this).find('input[name=need_ram]').val() * 1;
         need_tap = $(this).find('input[name=need_tap]').val() * 1;
         var taskObj = {
             index: i,
             name: name,
             arrive_time: arrive_time,
             run_time: run_time,
             need_ram: need_ram,
             need_tap: need_tap,
             state: 'wait'
         };
         taskArr.push(taskObj);
     });
 }
 /**
  * Job_FCFS 排序   根据作业到达时间
  */
 function sortByArrive(a,b){
    return a.arrive_time - b.arrive_time;
 }
 /**
  * Process_FCFS 排序  根据进程进入时间
  * @param  enter_time_mark 进入时间的顺序标记
  * @return 如果同时到达，则按顺序排序
  */
 function sortByEnter(a,b){
    if(a.enter_time == b.enter_time){
        return a.enter_time_mark - b.enter_time_mark;
    }
    return a.enter_time - b.enter_time;
 }
 /**
  * SJF 排序  根据作业大小即Ram
  */
 function sortByRam(a,b){
     return a.need_ram - b.need_ram;
 }
 /**
  * SPF 排序 根据进程运行时间
  */
 function sortByRunTime(a,b){
     return a.run_time - b.run_time;
 }
 /**
  * HRRN 排序 按优先级降序排序   优先级 = (作业已等待时间 + 作业的服务时间) / 作业的服务时间
  */
 function sortByLevel(a,b){
     return ((current_time - b.arrive_time + b.run_time) / b.run_time) - ((current_time - a.arrive_time + a.run_time) / a.run_time);
 }
 /**
  * 遍历各种状态的作业进程
  */
 function findState(arr){
     var wait = [], ready = [], run = [];
     var obj = {};
     $(arr).each(function(){
        if(this.state == 'wait'){
            wait.push(this);
        }else if(this.state == 'ready'){
            ready.push(this);
        }else if(this.state == 'run'){
            run.push(this);
        }
     });
     obj.wait = wait;
     obj.ready = ready;
     obj.run = run;
     return obj;
 }

/**
 * Job_FCFS
 */
function Job_FCFS(){
    var obj = findState(taskArr);
    //从等待进程中按照到达时间排序
    var order = obj['wait'].sort(sortByArrive); 
    var mark = 1;
    $(order).each(function(i,val){
        if(current_time >= val.arrive_time){
            if(current_time == val.arrive_time){
               $runLog.append(
                   current_time + "时刻" + val.name + "到达需要RAM，TAP"
                    + val.need_ram + ',' + val.need_tap + "剩余RAM:"
                     + rest_RAM + "剩余TAP:" + rest_TAP + "<br/>"
                   );
               //显示在等待列表 wait_group
               $('#wait_group').append(
                   "<li class='list-group-item' name='task_" + val.index +"'>"
                    + current_time + "时刻&emsp;" + val.name
                    + "---运行时间:" + val.run_time
                    + "，需要资源[" + val.need_ram + "," + val.need_tap +"]</li>"
               );
            }
            //内存，磁带机足够，可以运行
            if(val.need_ram <= rest_RAM && val.need_tap <= rest_TAP){
                taskArr[val.index].state = 'ready';
                taskArr[val.index].enter_time = current_time;
                taskArr[val.index].enter_time_mark = mark++;
                rest_RAM -= val.need_ram;
                rest_TAP -= val.need_tap;
                $runLog.append(
                    current_time + "时刻" + val.name + "进入就绪，剩余RAM:"
                    + rest_RAM + "剩余TAP:" + rest_TAP + "<br/>"
                );
                //从等待列表中移除,显示在就绪列表 ready_group
                $('[name=task_' + val.index + ']').remove();
                $('#ready_group').append(
                    "<li class='list-group-item' name='task_" + val.index + "'>"
                    + current_time + "时刻&emsp;" + val.name
                    + "---运行时间:" + val.run_time 
                    + ",需要资源[" + val.need_ram + "," + val.need_tap + "]</li>"
                );
            }
        }
    });
}
/**
 * SJF  非抢占
 */
function SJF(){
    var obj = findState(taskArr);
    //从等待进程中按照运行时间排序
    var order = obj['wait'].sort(sortByRunTime);
    var mark = 1;
    $(order).each(function(i,val){
        if(current_time >= val.arrive_time){
            if(current_time == val.arrive_time){
               $runLog.append(
                   current_time + "时刻" + val.name + "到达需要RAM，TAP"
                    + val.need_ram + ',' + val.need_tap + "剩余RAM:"
                     + rest_RAM + "剩余TAP:" + rest_TAP + "<br/>"
                   );
               //显示在等待列表 wait_group
               $('#wait_group').append(
                   "<li class='list-group-item' name='task_" + val.index +"'>"
                    + current_time + "时刻&emsp;" + val.name
                    + "---运行时间:" + val.run_time
                    + "，需要资源[" + val.need_ram + "," + val.need_tap +"]</li>"
               );
            }
            //内存，磁带机足够，可以运行
            if(val.need_ram <= rest_RAM && val.need_tap <= rest_TAP){
                taskArr[val.index].state = 'ready';
                taskArr[val.index].enter_time = current_time;
                taskArr[val.index].enter_time_mark = mark++;
                rest_RAM -= val.need_ram;
                rest_TAP -= val.need_tap;
                $runLog.append(
                    current_time + "时刻" + val.name + "进入就绪，剩余RAM:"
                    + rest_RAM + "剩余TAP:" + rest_TAP + "<br/>"
                );
                //从等待列表中移除,显示在就绪列表 ready_group
                $('[name=task_' + val.index +']').remove();
                $('#ready_group').append(
                    "<li class='list-group-item' name='task_" + val.index + "'>"
                    + current_time + "时刻&emsp;" + val.name
                    + "---运行时间:" + val.run_time 
                    + ",需要资源[" + val.need_ram + "," + val.need_tap + "]</li>"
                );
            }
        }
    });
}
/**
 * Process_FCFS
 */
function Process_FCFS(){
    var obj = findState(taskArr);
    //就绪进程按照到达时间排序
    var order = obj['ready'].sort(sortByEnter);
    $(order).each(function(i,val){
        if(RP == 0){
            return;
        }
        taskArr[val.index].state = 'run';
        taskArr[val.index].start_run_time = current_time;
        RP--; //消耗一个进程
        $runLog.append(
            current_time + "时刻:" + taskArr[val.index].name 
            + "开始运行，需要运行时间" + taskArr[val.index].run_time
            + ";预计完成时间:" + (taskArr[val.index].run_time + current_time)
            + ";剩余进程数:" + RP + "<br/>"
            );
        //从就绪列表中移除,显示在运行列表 run_group
        sleep(500).then(()=>{
            $('[name=task_' + val.index +']').remove();
            $('#run_group').append(
                "<li class='list-group-item' name='task_" + val.index +"'>"
                + current_time + "时刻&emsp;" + val.name + ";资源[" 
                + val.need_ram + "," + val.need_tap + "]</li>"
            );

        });
    });
}
/**
 * SRT   非抢占
 */
function SPF(){
    var obj = findState(taskArr);
    //就绪进程按照最短进程排序 即运行时间
    var order = obj['ready'].sort(sortByRunTime);
    $(order).each(function(i,val){
        if(RP == 0){
            return;
        }
        taskArr[val.index].state = 'run';
        taskArr[val.index].start_run_time = current_time;
        RP--; //消耗一个进程
        $runLog.append(
            current_time + "时刻:" + taskArr[val.index].name 
            + "开始运行，需要运行时间" + taskArr[val.index].run_time
            + ";预计完成时间:" + (taskArr[val.index].run_time + current_time)
            + ";剩余进程数:" + RP + "<br/>"
        );
         //从就绪列表中移除,显示在运行列表 run_group
        sleep(500).then(()=>{
            $('[name=task_' + val.index +']').remove();
            $('#run_group').append(
                "<li class='list-group-item' name='task_" + val.index +"'>"
                + current_time + "时刻&emsp;" + val.name + ";资源[" 
                + val.need_ram + "," + val.need_tap + "]</li>"
            );
        });
    });
}
/**
 * Job_HRRN 高响应比优先级调度
 * @param  优先级 = （作业已等待时间 + 作业运行时间）/ 作业运行时间
 */
function Job_HRRN(){
    var obj = findState(taskArr);
    var order = obj['wait'].sort(sortByArrive);
    var mark = 1;
    $(order).each(function(i,val){
    if(current_time >= val.arrive_time){
        if(current_time == val.arrive_time){
            $runLog.append(
                current_time + "时刻" + val.name + "到达需要RAM，TAP"
                + val.need_ram + ',' + val.need_tap + "剩余RAM:"
                    + rest_RAM + "剩余TAP:" + rest_TAP + "<br/>"
                );
            //显示在等待列表 wait_group
            $('#wait_group').append(
                "<li class='list-group-item' name='task_" + val.index +"'>"
                + current_time + "时刻&emsp;" + val.name
                + "---运行时间:" + val.run_time
                + "，需要资源[" + val.need_ram + "," + val.need_tap +"]</li>"
            );
        }
        if(val.need_ram <= rest_RAM && val.need_tap <= rest_TAP){
            taskArr[val.index].state = 'ready';
            $runLog.append(
                current_time + "时刻" + val.name + "进入就绪，剩余RAM:"
                + rest_RAM + "剩余TAP:" + rest_TAP
                + ",已等待时间:" + (current_time - taskArr[val.index].arrive_time)
                + ",响应优先级:" + ((current_time - taskArr[val.index].arrive_time + taskArr[val.index].run_time) / taskArr[val.index].run_time).toFixed(4) 
                + "<br/>"
            );
            //从等待列表中移除,显示在就绪列表 ready_group
            $('[name=task_' + val.index +']').remove();
            $('#ready_group').append(
                "<li class='list-group-item' name='task_" + val.index + "'>"
                + current_time + "时刻&emsp;" + val.name
                + "---运行时间:" + val.run_time 
                + ",需要资源[" + val.need_ram + "," + val.need_tap + "]</li>"
            );
        }
    }
    });
}
/**
 * HRRN 非抢占
 */
function HRRN(){
    var obj = findState(taskArr);
    //按照响应优先级排序
    var order = obj['ready'].sort(sortByLevel);
    var mark = 1;
    $(order).each(function(i,val){
        if(RP == 0){
            return;
        }
        taskArr[val.index].enter_time = current_time;
        taskArr[val.index].enter_time_mark = mark++;  //已经就绪的标志位
        rest_RAM -= val.need_ram;
        rest_TAP -= val.need_tap;
        taskArr[val.index].state = 'run';
        taskArr[val.index].start_run_time = current_time;
        RP--; 
        $runLog.append(
            current_time + "时刻:" + taskArr[val.index].name 
            + "开始运行，需要运行时间" + taskArr[val.index].run_time
            + ";预计完成时间:" + (taskArr[val.index].run_time + current_time)
            + ";剩余进程数:" + RP + "<br/>"
        );
        //从就绪列表中移除,显示在运行列表 run_group
        sleep(500).then(()=>{
            $('[name=task_' + val.index +']').remove();
            $('#run_group').append(
                "<li class='list-group-item' name='task_" + val.index +"'>"
                + current_time + "时刻&emsp;" + val.name + ";资源[" 
                + val.need_ram + "," + val.need_tap + "]</li>"
            );
        });
    });
}
/**
 * 遍历所有作业都已完成
 * @return  boolean
 */
function IfEnd(){
    var end = true;
    $(taskArr).each(function(i,val){
        if(val.state != 'finish'){
            end = false;
            return end;
        }
    });
    return end;
}
/**
 * 计算平均周转时间并加载显示
 * time :周转时间 
 * aver_time : total/num 平均周转时间
 */
function aver_time(){
    var total = 0, W_total = 0;
    var num = $(taskArr).length;
    $(taskArr).each(function(){
        //完成时间-到达时间 -->周转时间
        //周转时间/运行时间 -->带权周转时间
        var time = this.finish_time - this.arrive_time;
        var W_time = time/this.run_time;
        total += time;
        W_total += W_time;
        $('#result_table').append(
            "<tr><td>" + this.name +
            "</td><td>" + this.arrive_time +
            "</td><td>" + this.enter_time + 
            "</td><td>" + this.finish_time +
            "</td><td>" + time +
            "</td><td>" + W_time.toFixed(2) +
            "</td></tr>"
            );
        });
        $('#aver_time').html("平均周转时间：" + (total/num).toFixed(2) + "&emsp;&emsp;平均带权周转时间：" + (W_total/num).toFixed(2));
}
    
/**
 * 运行进程  非抢占
 */
function run(){
    var running  = findState(taskArr).run; //在运行的进程列表
    $(running).each(function(){
        //已经运行的时间==进程运行时间 -->完成
        if(current_time - this.start_run_time == this.run_time){
            taskArr[this.index].finish_time = current_time;
            taskArr[this.index].state = 'finish';
            //资源释放
            rest_RAM += taskArr[this.index].need_ram;
            rest_TAP += taskArr[this.index].need_tap;
            //归还进程
            RP++;
            $runLog.append(
                current_time + "时刻:" + taskArr[this.index].name 
                + "处理完成，剩余RAM:" + rest_RAM 
                + "剩余TAP:" + rest_TAP
                + "剩余进程数:" + RP + "<br/>"
            );
            //从运行列表移除，显示在完成列表 finish_group
            $('[name=task_' + this.index + ']').remove();
            $('#finish_group').append(
                "<li class='list-group-item' name='task_" + this.index +"'>"
                + current_time + "时刻&emsp;" + this.name
                + ";资源[" + this.need_ram + "," + this.need_tap + "]</li>"
            );
            current_time--;
        }
    });
}
/**
 * sleep 调用Promise API改良setTimeout(),解决就绪->运行动态刷新过快
 * 用法: sleep(time).then(()=>{
 *    dosomething
 * });
 * @return 返回封装后的Promise的sleep()函数
 */
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
/**
 * 主函数
 */
$(function(){
    var JobType, PType;
    var interval; //时间间隔0.5s
    $('#start_btn').click(function(){
        JobType = $('input[name=job]:checked').val();
        PType = $('input[name=process]:checked').val();
        RP = parseInt($('#runprocess_num').val()) || 1;
        rest_RAM = parseInt($('#ram').val()) || 100;
        rest_TAP = parseInt($('#tap').val()) || 1;
        getData();
        console.log(JobType+","+PType);
        $runLog = $('#run_log');
        interval = setInterval(function(){
            $('#r_time').html(current_time);
            $('#r_ram').html(rest_RAM);
            $('#r_tap').html(rest_TAP);
            $('#r_rp').html(RP);
            if(JobType == "Job_FCFS"){
                Job_FCFS();
            }else if(JobType == "Job_HRRN"){
                Job_HRRN();
            }else{
                SJF();
            }
            if(PType == "Process_FCFS"){
                Process_FCFS();
            }else if(PType == "HRRN"){
                HRRN();
            } else{
                SPF();
            }
            run();
            current_time++;
            if(IfEnd()){
                clearInterval(interval);
                $runLog.append("运行结束" + "<br/>");
                $('#r_ram').html(rest_RAM);
                $('#r_tap').html(rest_TAP);
                $('#r_rp').html(RP);
                aver_time();
            }
        },500);
    });
    $('#stop_btn').click(function(){
        clearInterval(interval);
        $runLog.append("运行结束" + "<br/>");
    });
    $('#reset_btn').click(function(){
        RP = 1;
        taskArr = [];
        rest_RAM = 100;
        rest_TAP = 1;
        current_time = 0;
        $('#run_log').html("");
        $('#show_ui').html(
            "<div class=\"col-md-3\"><ul class=\"list-group\" id=\"wait_group\">" +
            " <li class=\"list-group-item text-center\"><b>等待(堵塞)</b></li> </ul> </div>" +
            " <div class=\"col-md-3\"> <ul class=\"list-group\" id=\"ready_group\">" +
            " <li class=\"list-group-item text-center\"><b>就绪</b></li>  </ul>  </div>" +
            " <div class=\"col-md-3\"> <ul class=\"list-group\" id=\"run_group\">" +
            " <li class=\"list-group-item text-center\"><b>运行</b></li>  </ul> </div>" +
            " <div class=\"col-md-3\"><ul class=\"list-group\" id=\"finish_group\">" +
            " <li class=\"list-group-item text-center\"><b>完成</b></li>  </ul>  </div>"
            ); 
        $('#result_table').html("");
        $('#aver_time').html(" ");
        $('#runprocess_num').val("");
        $('#ram').val("");
        $('#tap').val("");
    });
    $('#add_btn').click(function(){
        var content = " <tr> <td><input type='text' name='name'></td> " +
        "<td><input type='text' name='arrive_time'></td>" +
        " <td><input type='text' name='run_time'></td> " +
        "<td><input type='text' name='need_ram'></td> " +
        "<td><input type='text' name='need_tap'></td> </tr>";
        $('#table').append(content);
    });
    $('#remove_btn').click(function(){
        $('#table tr:last').remove();
    })
});
        