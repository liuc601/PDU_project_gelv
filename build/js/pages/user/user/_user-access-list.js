/* 

*用户权限备份

*/
var userAccessList = [//0是admin帐号的权限，1,是user帐号的权限，2，是view帐号的权限
    {
        userLevel: 0,
        isEditView: false,//user帐号可以编辑，默认都为true
        isEditControl: false,//user帐号可以编辑，默认都为true
        accessList: [
            { "type": "Monitor", "id": "-", "name": "System", "access": { "view": true, }, "view": true, },
            { "type": "Port", "id": "-", "name": "Console", "access": { "view": true, }, "view": true, },
            { "type": "Agreement", "id": "-", "name": "SNMPv3", "access": { "view": true, }, "view": true, },
            { "type": "Outlet", "id": "N1", "name": "Outlet1-1", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N2", "name": "Outlet1-2", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N3", "name": "Outlet1-3", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N4", "name": "Outlet1-4", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N5", "name": "Outlet1-5", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N6", "name": "Outlet1-6", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N7", "name": "Outlet1-7", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N8", "name": "Outlet1-8", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N9", "name": "Outlet1-9", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N10", "name": "Outlet1-10", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N11", "name": "Outlet1-11", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N12", "name": "Outlet1-12", "access": { "view": true, "control": true }, "view": true, "control": true }],

    },
    {
        userLevel: 1,
        isEditView: true,//user帐号可以编辑，默认都为true
        isEditControl: true,//user帐号可以编辑，默认都为true
        accessList: [
            { "type": "Monitor", "id": "-", "name": "System", "access": { "view": false, }, "view": true, },
            { "type": "Port", "id": "-", "name": "Console", "access": { "view": false, }, "view": true, },
            { "type": "Agreement", "id": "-", "name": "SNMPv3", "access": { "view": false, }, "view": true, },
            { "type": "Outlet", "id": "N1", "name": "Outlet1-1", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N2", "name": "Outlet1-2", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N3", "name": "Outlet1-3", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N4", "name": "Outlet1-4", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N5", "name": "Outlet1-5", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N6", "name": "Outlet1-6", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N7", "name": "Outlet1-7", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N8", "name": "Outlet1-8", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N9", "name": "Outlet1-9", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N10", "name": "Outlet1-10", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N11", "name": "Outlet1-11", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N12", "name": "Outlet1-12", "access": { "view": true, "control": true }, "view": true, "control": true }],
    },
    {
        userLevel: 2,
        isEditView: true,//user帐号可以编辑，默认都为true
        isEditControl: false,//user帐号可以编辑，默认都为true
        accessList: [
            { "type": "Monitor", "id": "-", "name": "System", "access": { "view": false, }, "view": true, },
            { "type": "Port", "id": "-", "name": "Console", "access": { "view": false, }, "view": true, },
            { "type": "Agreement", "id": "-", "name": "SNMPv3", "access": { "view": false, }, "view": true, },
            { "type": "Outlet", "id": "N1", "name": "Outlet1-1", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N2", "name": "Outlet1-2", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N3", "name": "Outlet1-3", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N4", "name": "Outlet1-4", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N5", "name": "Outlet1-5", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N6", "name": "Outlet1-6", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N7", "name": "Outlet1-7", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N8", "name": "Outlet1-8", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N9", "name": "Outlet1-9", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N10", "name": "Outlet1-10", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N11", "name": "Outlet1-11", "access": { "view": true, "control": true }, "view": true, "control": true },
            { "type": "Outlet", "id": "N12", "name": "Outlet1-12", "access": { "view": true, "control": true }, "view": true, "control": true }],
    },
],