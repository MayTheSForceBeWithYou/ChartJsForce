public with sharing class AccountOppAnalyticsController {
    @AuraEnabled
    public static List<AggregateResult> retrieveMonthlyTotals(Id accountId, Integer numOfMonths) {
        String aggResultQuery = 
            'SELECT CALENDAR_YEAR(Opportunity.CloseDate) calYear, CALENDAR_MONTH(Opportunity.CloseDate) calMonth, SUM(TotalPrice) sumPrice ' +
            'FROM OpportunityLineItem WHERE Opportunity.CloseDate = LAST_N_MONTHS:' + numOfMonths +
            ' AND Opportunity.AccountId = :accountId AND Opportunity.StageName = \'Closed Won\' ' +
            'GROUP BY CALENDAR_YEAR(Opportunity.CloseDate), CALENDAR_MONTH(Opportunity.CloseDate) ' +
            'ORDER BY CALENDAR_YEAR(Opportunity.CloseDate) ASC, CALENDAR_MONTH(Opportunity.CloseDate) ASC';
        List<AggregateResult> aggResults = (List<AggregateResult>)Database.query(aggResultQuery);
        for(AggregateResult ar : aggResults) {
            System.debug(ar);
        }
        return aggResults;
    }
}