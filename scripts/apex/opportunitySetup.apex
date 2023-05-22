Account acct = new Account(
    Name = 'Test Account'
);
insert acct;
Pricebook2 pbStandard = [SELECT Id FROM Pricebook2 WHERE Name = 'Standard Price Book' LIMIT 1];
List<Opportunity> opps = new List<Opportunity>();
// Create 10 opportunities per month over the last 3 months
Date firstOfCurrentMonth = Date.today().toStartOfMonth();
for(Integer idxMonth = 1; idxMonth <= 3; idxMonth++) {
    Date firstOfThaMonth = firstOfCurrentMonth.addMonths(-idxMonth);
    // Days in month
    Integer daysInMonth = Date.daysInMonth(firstOfThaMonth.year(), firstOfThaMonth.month());
    for(Integer idxOpp = 1; idxOpp <= 10; idxOpp++) {
        // Randomly spread opportunities throughout month
        Date closeDate = firstOfThaMonth.addDays((Math.random()*daysInMonth).intValue());
        String oppName = String.valueOf(closeDate.month()) + '/' + String.valueOf(closeDate.year()) + ' Opp ';
        oppName += (idxOpp < 10) ? '0' : '';
        oppName += String.valueOf(idxOpp);
        opps.add(
            new Opportunity(
                AccountId = acct.Id,
                CloseDate = closeDate,
                Name = oppName,
                Pricebook2Id = pbStandard.Id,
                StageName = 'Closed Won'
            )
        );
    }
}
insert opps;
// Create a random number of OpportunityLineItems for each opp (between 1 and 10)
List<PricebookEntry> pbes = [SELECT Id, Product2Id, UnitPrice FROM PricebookEntry WHERE Pricebook2.IsStandard = true];
Map<Id, PricebookEntry> prodIdToPbe = new Map<Id, PricebookEntry>();
for(PricebookEntry pbe : pbes) {
    prodIdToPbe.put(pbe.Product2Id, pbe);
}
List<Product2> products = [SELECT Id FROM Product2];
// Integer numOfPbes = pbes.size();
Integer numOfProducts = products.size();
List<OpportunityLineItem> oppLineItems = new List<OpportunityLineItem>();
for(Opportunity opp : opps) {
    Integer randomNumberOfOLIs = ((Math.random() * 10) + 1).intValue();
    for(Integer idxOLI = 0; idxOLI < randomNumberOfOLIs; idxOLI++) {
        // PricebookEntry pbe = pbes[(Math.random()*pbes.size()).intValue()];
        Product2 prod = products[(Math.random()*products.size()).intValue()];
        PricebookEntry standardPbe = prodIdToPbe.get(prod.Id);
        Integer quantityOfOLI = ((Math.random() * 10) + 1).intValue();
        Decimal totalPrice = quantityOfOLI * standardPbe.UnitPrice;
        oppLineItems.add(
            new OpportunityLineItem(
                OpportunityId = opp.Id,
                Product2Id = prod.Id,
                // PricebookEntryId = pbe.Id,
                Quantity = quantityOfOLI,
                TotalPrice = totalPrice
            )
        );
    }
}
insert oppLineItems;