const elasticsearch = require('elasticsearch');
const indexName = 'demo_elastic_index';
const query = 'Vrčeň';
const searchData = async () => {
    const client = new elasticsearch.Client({
        host: 'localhost:9200',
        // log: 'trace',
    });
    await client.ping({
        requestTimeout: 3000
    }, function (error) {
        if (error) {
            console.trace('elasticsearch cluster is down!');
        } else {
            console.log('Elastic search is running.');
        }
    });
    try {
        const resp = await client.search({
            index: indexName,
            type: 'place',
            body: {
                sort: [
                    {
                        place_rank_num: { order: 'desc' },
                    },
                    {
                        importance_num: { order: 'desc' },
                    },
                ],
                query: {
                    bool: {
                        should: [{
                            match_all: {}
                        }
                        ]
                    },
                },
            },
        });
        const { hits } = resp.hits;
        console.log(hits);
    } catch (e) {
        //   console.log("Error in deleteing index",e);
        if (e.status === 404) {
            console.log('Index Not Found');
        } else {
            throw e;
        }
    }
}
searchData();