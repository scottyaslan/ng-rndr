(function(root, factory) {
    define(['$rndrDataViews',
        '$rndrSorters',
        '$rndrSortersTemplates',
        '$rndrDerivedAttributes',
        '$rndrDeriverTemplates',
        '$rndrFormattersTemplates',
        '$rndrFormatters',
        '$rndrAggregatorsTemplates',
        '$rndrAggregators',
        'rndrRenderingEngine'
    ], function() {
        return factory(root);
    });
}(this, function(root) {
    return root.rndr;
}));