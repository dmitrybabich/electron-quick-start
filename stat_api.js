class StatApi {
    getFirstLevelUri(teamName) {
        return `https://internal.devexpress.com/supportstat/TicketList?AssigneeGuid=00000000-0000-0000-0000-000000000000&SupportTeam=${teamName}&TicketStatus=AFS`;
    }

    getFirstLevelTicketCountUri(teamName) {
        return `https://internal.devexpress.com/supportstat/Data/GetActiveTicketsInfo?Assignee=FirstLevel&SupportTeam=${teamName}&TicketStatus=AFS`;
    }


      getSecondLevelUri(teamName) {
        return `https://internal.devexpress.com/supportstat/TicketList?AssigneeGuid=2f795f88-e3ef-4913-9fdb-66c1e7525766&SupportTeam=${teamName}&TicketStatus=AFS`;
    }

    getSecondLevelTicketCountUri(teamName) {
        return `https://internal.devexpress.com/supportstat/Data/GetActiveTicketsInfo?Assignee=SecondLevel&SupportTeam=${teamName}&TicketStatus=AFS`;
    }



          getMeUri(id, teamName) {
        return `https://internal.devexpress.com/supportstat/TicketList?AssigneeGuid=${id}&SupportTeam=${teamName}&TicketStatus=AFS`;
    }

    getMeTicketCountUri(id, teamName) {
        return `https://internal.devexpress.com/supportstat/Data/GetActiveTicketsInfo?AssigneeGuid=${id}&IgnoreSupportTeam=True&SupportTeam=${teamName}&TicketStatus=AFS`;
    }
}

module.exports = new StatApi();