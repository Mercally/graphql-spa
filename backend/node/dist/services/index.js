"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServices = buildServices;
const customer_repository_1 = require("../repositories/customer.repository");
const project_repository_1 = require("../repositories/project.repository");
const team_repository_1 = require("../repositories/team.repository");
const user_repository_1 = require("../repositories/user.repository");
const task_repository_1 = require("../repositories/task.repository");
const tag_repository_1 = require("../repositories/tag.repository");
const comment_repository_1 = require("../repositories/comment.repository");
const customer_service_1 = require("./customer.service");
const project_service_1 = require("./project.service");
const team_service_1 = require("./team.service");
const user_service_1 = require("./user.service");
const task_service_1 = require("./task.service");
const tag_service_1 = require("./tag.service");
const comment_service_1 = require("./comment.service");
function buildServices(db) {
    const repos = {
        customers: new customer_repository_1.CustomerRepository(db),
        projects: new project_repository_1.ProjectRepository(db),
        teams: new team_repository_1.TeamRepository(db),
        users: new user_repository_1.UserRepository(db),
        tasks: new task_repository_1.TaskRepository(db),
        tags: new tag_repository_1.TagRepository(db),
        comments: new comment_repository_1.CommentRepository(db)
    };
    return {
        repos,
        customers: new customer_service_1.CustomerService(repos.customers),
        projects: new project_service_1.ProjectService(repos.projects, repos.customers),
        teams: new team_service_1.TeamService(repos.teams, repos.projects, repos.users),
        users: new user_service_1.UserService(repos.users),
        tasks: new task_service_1.TaskService(repos.tasks, repos.projects, repos.users, repos.tags),
        tags: new tag_service_1.TagService(repos.tags),
        comments: new comment_service_1.CommentService(repos.comments, repos.tasks, repos.users)
    };
}
//# sourceMappingURL=index.js.map