class StatApi {
getFirstLevelUri (teamName) {
        return `https://internal.devexpress.com/supportstat/TicketList?AssigneeGuid=00000000-0000-0000-0000-000000000000&SupportTeam=${teamName}&TicketStatus=AFS`;
    }

    getFirstLevelTicketCountUri (id, teamName) {
        return `https://internal.devexpress.com/supportstat/Data/GetActiveTicketsInfo?Assignee=FirstLevel&SupportTeam=${teamName}&TicketStatus=AFS`;
    }
}

module.exports = new StatApi();