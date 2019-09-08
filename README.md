# 进程调度算法模拟
## 调度算法
* 先来先服务（FCFS）调度算法：即可用于作业调度，也可用于进程调度。
    * 在作业调度中：算法每次从后备队列中选择最先进入该队列的一个或几个作业，将它们调入内存，分配必要的资源，创建进程并放入就绪队列。
    * 在进程调度中：FCFS调度算法每次从就绪队列中选择最先进入该队列的进程，将处理机分配给它，使之运行，直至完成或因某种原因而阻塞才释放处理机。
* 短作业(SJF)、进程(SPF) 优先调度算法
    * SJF调度算法：从后备队列中选择一个或若干个运行时间最短的作业，将它们调入内存运行。
    * SPF调度算法：是从就绪队列中选择一个运行时间最短的作业，将处理机分配给它，使之运行，直至完成或因某种原因而阻塞才释放处理机。
* 高响度比优先级（HRRN）调度算法
    * 主要用于作业调度，该算法是对FCFS调度算法和SJF调度算法的一种综合平衡，同时考虑每个作业的等待时间和运行时间。在每次作业调度中，先计算就绪队列中每个作业响应比，从中选出响应比最高的作业投入运行。
    * 响应比Rq = (等待时间 + 要求服务时间) / 要求服务时间
    * 根据公式可知：
        - 当作业的等待时间相同时，则要求服务时间越短，响应比越高，有利于短作业。
        - 当要求服务时间相同时，作业的响应比由其等待时间决定，等待时间越长，其响应比越高，因而它实现的是先来先服务。
        - 对于长作业，作业的响应比可以随等待时间的增加而提高，当其等待时间足够长时，其响应比便可升到很高，从而获得处理机。克服了饥饿状态，兼顾了长作业。

## 实现：
* FCFS：将任务队列按到达时间排序，遍历任务队列，当前时间等于作业到达时间，判断系统资源是否足够分配，足够则进入就绪队列，分配资源。将就绪队列按照进入时间排序，遍历就绪队列，系统进程足够，则运行直到进程完成。
* SJF/SPF：将任务队列按运行时间排序，遍历任务队列，当前间等于作业到达时间，判断系统资源是否足够分配，足够则进入就绪队列，分配资源。将就绪队列按照运行时间排序，遍历就绪队列，系统进程足够，则运行直到进程完成。
* HRRN: 将任务队列按到达时间排序，遍历任务队列，当前时等于作业到达时间，判断系统资源是否足够分配，足够则进入就绪队列，不分配资源。将就绪队列按照响应比优先级排序，遍历就绪队列，系统进程足够，才分配资源，运行直到进程完成。

## 效果预览：

![index](https://github.com/banbanzzz/Process/blob/master/image/img/index.png) 
![index1](https://github.com/banbanzzz/Process/blob/master/image/img/index2.png) 

### 参数：
![参数](https://github.com/banbanzzz/Process/blob/master/image/短进程算法验证/参数.PNG) 
### FCFS:
![fcfs-result](https://github.com/banbanzzz/Process/blob/master/image/FCFS算法验证/result_table.PNG)
![fcfs-log](https://github.com/banbanzzz/Process/blob/master/image/FCFS算法验证/run_log.PNG)
### SJF/SPF:
![S-result](https://github.com/banbanzzz/Process/blob/master/image/短进程算法验证/result_table.PNG)
![S-log](https://github.com/banbanzzz/Process/blob/master/image/短进程算法验证/run_log.PNG)
### HRRN
![HRRN-result](https://github.com/banbanzzz/Process/blob/master/image/HRRN算法验证/table_result.PNG)
![HRRN-log](https://github.com/banbanzzz/Process/blob/master/image/HRRN算法验证/run_log.PNG)
