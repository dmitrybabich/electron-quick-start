class StatApi {
    getFirstLevelUri(teamId) {
        return `https://internal.devexpress.com/supportstat/TicketList?Date=&Teams=[{"ID":"${teamId}"}]&TicketStatus=AFS&Users=[{"ID":"00000000-0000-0000-0000-000000000000"}]`;
    }

    getFirstLevelTicketCountUri(teamId) {
        return `https://internal.devexpress.com/supportstat/Data/GetActiveTicketsInfo?Teams=[{"ID":"${teamId}"}]&TicketStatus=AFS&Users=[{"ID":"00000000-0000-0000-0000-000000000000"}]`;
    }

    getRepliesUrl() {
        return "https://internal.devexpress.com/supportstat/RepliesList?Date=Today&SupportTeam=WinForms&SupportTeamGuid=9a5630d0-2282-11e2-8364-c44619bb1483&Users=[{%22Name%22:%22Babich%20Dmitry%22,%22ID%22:%22d3377813-6dae-40ea-83d8-8b291e5bfbc8%22}]";
    }

    getSecondLevelUri(teamId) {
        return `https://internal.devexpress.com/supportstat/TicketList?Date=&Teams=[{"ID":"${teamId}"}]&TicketStatus=AFS&Users=[{"ID":"2f795f88-e3ef-4913-9fdb-66c1e7525766"}]`;
    }

    getSecondLevelTicketCountUri(teamId) {
        return `https://internal.devexpress.com/supportstat/Data/GetActiveTicketsInfo?Teams=[{"ID":"${teamId}"}]&TicketStatus=AFS&Users=[{"ID":"2f795f88-e3ef-4913-9fdb-66c1e7525766"}]`;
    }



    getMyTeamSituatioUrl(teamName) {
        return `https://internal.devexpress.com/supportstat/MyTeam?teamName=${teamName}`;
    }



    getMeUri(id, teamId) {
        return `https://internal.devexpress.com/supportstat/TicketList?Date=&IgnoreSupportTeam=True&Teams=[{"ID":"${teamId}"}]&TicketStatus=AFS&Users=[{"ID":"${id}"}]`;
    }

    getMeTicketCountUri(id, teamId) {
        return `https://internal.devexpress.com/supportstat/Data/GetActiveTicketsInfo?Teams=[{"ID":"${teamId}"}]&TicketStatus=AFS&Users=[{"ID":"${id}"}]`;
    }
}

module.exports = new StatApi();