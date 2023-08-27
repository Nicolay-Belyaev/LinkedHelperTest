export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    let tasksInWork: ITask[] = [];
    let runningPromises: Array<Promise<void>> = [];
    const takenTasksProcessor = async () => {
        for (const takenTask of tasksInWork) {
            runningPromises.push(executor.executeTask(takenTask));
        }
        await Promise.all(runningPromises);
        tasksInWork = [];
        runningPromises = [];
    };
    const mainTaskProcessor = async (startTask: ITask | null) => {
        if (startTask) {
            tasksInWork.push(startTask);
        }
        for await (const task of queue) {
    // Проверяем, нет ли у нас таски с таким ID. Если есть, делаем ту таску с этим ID, которая у нас в списке уже лежит.
    // НЕ добавляет текущую таску, потому что это сделает else в следующем блоке if-else.
            for (const takenTask of tasksInWork) {
                if (takenTask.targetId === task.targetId) {
                    await executor.executeTask(takenTask);
                    tasksInWork.splice(tasksInWork.indexOf(takenTask), 1);
                    break;
                }
            }
    // Если есть ограничение по количеству "потоков" и мы набрали равное ему количество задач - исполняем их.
    // В противном случае просто добавляем текущую таску в список на исполнение.
            if (maxThreads !== 0 && tasksInWork.length >= maxThreads) {
                await takenTasksProcessor();
                tasksInWork.push(task);
            } else {
                tasksInWork.push(task);
            }
        }
        // Добиваем оставшиеся такси.
        await takenTasksProcessor();
    };
    await mainTaskProcessor(null);
    // Очередь "с добавками" добавляет таски по исполнению последний таски в "текущей" очереди.
    // После исполнения "первичной" очереди смотрим, нет ли в очереди чего новенького. Запускаем основную подфункцию с
    // первым новым элементом.
    for await (const task of queue) {
        await  mainTaskProcessor(task);
    }
}
