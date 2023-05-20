Pricebook2 pbStandard = [SELECT Id FROM Pricebook2 WHERE Name = 'Standard Price Book' LIMIT 1];
pbStandard.IsActive = true;
update pbStandard;
List<Product2> productsToInsert = new List<Product2>{
    new Product2(
        Name = 'Widget',
        IsActive = true
    ),
    new Product2(
        Name = 'Gadget',
        IsActive = true
    ),
    new Product2(
        Name = 'Doodad',
        IsActive = true
    ),
    new Product2(
        Name = 'Thingymajig',
        IsActive = true
    )
};
insert productsToInsert;
List<PricebookEntry> pbEntries = new List<PricebookEntry>();
for(Product2 prd : productsToInsert) {
    pbEntries.add(
        new PricebookEntry(
            IsActive = true,
            Pricebook2Id = pbStandard.Id,
            Product2Id = prd.Id,
            UnitPrice = 50
        )
    );
}
insert pbEntries;