#!/user/bin/env node
import fs from "fs"
import { Command } from "commander";
import inquirer from "inquirer";
const prog = new Command();
const filePath = "./taskes.json";
const getNextTaskId = () => {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const tasks = JSON.parse(fileContent);
    return tasks.length + 1;
  }
  return 1;
};
prog.name("to-do-list-cli").description("cli to make taskes").version("1.0.0");

prog
  .command("add")
  .description("add a new task")
  .argument("task name", "task name")
  .option("--todo", "make task status todo")
  .action((taskName, option) => {
    const taskId = getNextTaskId();
    const newTask = {
      "id": taskId,
      "task name": taskName,
      "status":"todo",
      "created at": new Date(),
    };
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, "utf-8", (err, fileContent) => {
        if (err) {
          console.log("Error", err);
          process.exit();
        }
        const fileContentAsjson = JSON.parse(fileContent);
        fileContentAsjson.push(newTask);
        fs.writeFile(
          filePath,
          JSON.stringify(fileContentAsjson,null,2),
          "utf8",
          () => {
            console.log("Adding task done");
          }
        );
      });
    } else {
      fs.writeFile(
        filePath,
        JSON.stringify([newTask]),
        "utf8",
        () => {
          console.log("Adding task done");
        }
      );
    }
  });
prog
  .command("update")
  .description("update a task")
  .argument('task id', 'task id')
  .argument('new name', 'new task name')
  .action((taskId, newName, option) => {
    fs.readFile(filePath, "utf-8", (err, content) => {
      if (err) {
        console.log("Error", err);
        process.exit();
      }
      let tasks = JSON.parse(content);
      const taskIndex = tasks.findIndex((task) => task.id == taskId)
      if (taskIndex !== -1) {
        tasks[taskIndex]["task name"] = newName;
        fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8', (err) => {
          if (err) {
            console.log('Error', err);
            process.exit();
          }
          console.log(`Task updated successfully.`);
        })
      } else {
        console.log(`Task with ID ${taskId} not found.`);
      }
    })
  });


prog
  .command("make-in-progress")
  .description("make a task in progress")
  .argument('task id', 'task id')
  .action((taskId,option) => {
    fs.readFile(filePath, "utf-8", (err, content) => {
      if (err) {
        console.log("Error", err);
        process.exit();
      }
      let tasks = JSON.parse(content);
      const taskIndex = tasks.findIndex((task) => task.id == taskId)
      if (taskIndex !== -1) {
        tasks[taskIndex]["status"] = "in-progress";
        fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8', (err) => {
          if (err) {
            console.log('Error', err);
            process.exit();
          }
          console.log(`Task updated successfully.`);
        })
      } else {
        console.log(`Task with ID ${taskId} not found.`);
      }
    })
  });




prog
  .command("make-done")
  .description("make a task done")
  .argument('task id', 'task id')
  .action((taskId,option) => {
    fs.readFile(filePath, "utf-8", (err, content) => {
      if (err) {
        console.log("Error", err);
        process.exit();
      }
      let tasks = JSON.parse(content);
      const taskIndex = tasks.findIndex((task) => task.id == taskId)
      if (taskIndex !== -1) {
        tasks[taskIndex]["status"] = "done";
        fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8', (err) => {
          if (err) {
            console.log('Error', err);
            process.exit();
          }
          console.log(`Task updated successfully.`);
        })
      } else {
        console.log(`Task with ID ${taskId} not found.`);
      }
    })
  });


prog
  .command("delete")
  .description("delet a task")
  .argument('task id', 'task id')
  .action((taskId,option) => {
    fs.readFile(filePath, "utf-8", (err, content) => {
      if (err) {
        console.log("Error", err);
        process.exit();
      }
      let tasks = JSON.parse(content);
      const taskIndex = tasks.findIndex((task) => task.id == taskId)
      if (taskIndex !== -1) {
         tasks.splice(taskIndex, 1);
        fs.writeFile(
          filePath,
          JSON.stringify(tasks, null, 2),
          "utf-8",
          (err) => {
            if (err) {
              console.log("Error", err);
              process.exit();
            }
            console.log(`Task deleted successfully.`);
          }
        );
      } else {
        console.log(`Task with ID ${taskId} not found.`);
      }
    })
  });


prog
  .command("list")
  .alias("ls")
  .description("list of tasks")
  .option('--done','tasks are done')
  .option('--progress','tasks are in-progress')
  .option('--todo','tasks are todo')
  .action((options) => {
    fs.readFile(filePath, "utf-8", (err, content) => {
      if (err) {
        console.log("Error", err);
        process.exit();
      }
      let tasks = JSON.parse(content);
      let filteredTaskes = tasks;
      if (options.done) {
        filteredTaskes = tasks.filter((task) => task.status === 'done')
      }
      else if (options.todo) {
        filteredTaskes = tasks.filter((task) => task.status === 'todo')
      }
      else if (options['progress']) {
        filteredTaskes = tasks.filter((task) => task.status === 'in-progress')
      }
      if (filteredTaskes.length === 0) {
        console.log("No tasks found with the specified status.");
      } else {
        console.table(filteredTaskes);
      }
    });
  });



  
prog.parse(process.argv);