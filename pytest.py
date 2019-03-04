import asyncio
import time


async def sleep(delay,name):
    await asyncio.sleep(3)
    print(f'{name} asyncSleep over')
    

async def task(name):
    print (f'task {name} started')
    await sleep(3,name)
    print (f'task {name} ended')

loop = asyncio.get_event_loop()

tasks=[
    loop.create_task(task('task1')),
    loop.create_task(task('task2'))
]

loop.run_until_complete(asyncio.wait(tasks))
loop.close()



