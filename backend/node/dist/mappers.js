"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCustomer = mapCustomer;
exports.mapProject = mapProject;
exports.mapTeam = mapTeam;
exports.mapUser = mapUser;
exports.mapTask = mapTask;
exports.mapTag = mapTag;
exports.mapComment = mapComment;
function mapCustomer(c) {
    return {
        id: c._id.toHexString(),
        name: c.name,
        email: c.email,
        createdAt: c.createdAt.toISOString()
    };
}
function mapProject(p) {
    return {
        id: p._id.toHexString(),
        name: p.name,
        description: p.description,
        customerId: p.customerId.toHexString(),
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
    };
}
function mapTeam(t) {
    return {
        id: t._id.toHexString(),
        name: t.name,
        projectId: t.projectId.toHexString(),
        memberUserIds: t.memberUserIds.map((id) => id.toHexString()),
        createdAt: t.createdAt.toISOString()
    };
}
function mapUser(u) {
    return {
        id: u._id.toHexString(),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString()
    };
}
function mapTask(t) {
    return {
        id: t._id.toHexString(),
        title: t.title,
        description: t.description,
        projectId: t.projectId.toHexString(),
        status: t.status,
        assignedUserId: t.assignedUserId ? t.assignedUserId.toHexString() : null,
        tagIds: t.tagIds.map((id) => id.toHexString()),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString()
    };
}
function mapTag(t) {
    return {
        id: t._id.toHexString(),
        name: t.name,
        color: t.color,
        createdAt: t.createdAt.toISOString()
    };
}
function mapComment(c) {
    return {
        id: c._id.toHexString(),
        text: c.text,
        taskId: c.taskId.toHexString(),
        userId: c.userId.toHexString(),
        createdAt: c.createdAt.toISOString()
    };
}
//# sourceMappingURL=mappers.js.map