
DOOF JS.
1. var key= new GetKeyModel(); key.fetch({data: { secret: "967d2b1f6111a198431532149879983a1ad3501224fb0dbf947499b1" }, type: 'POST'});
2. var apis = new ApisModel(); var pkey = apis.get('privateKey'); apis.fetch({ data: { "key": pkey }, type: 'POST' });