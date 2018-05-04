var config = {
development_windows: {
    //url to be used in link generation
    url: 'http://localhost:3000',
    //mongodb connection settings
    database: {
        host:   '127.0.0.1',
        username: 'root',
        password: '',
        port:   '3306',
        db:     'node_test'
    },
    //server details
    server: {
        host: '127.0.0.1',
        port: '3000'
    }
},
development_linux: {
    //url to be used in link generation
    url: 'http://localhost:3000',
    //mongodb connection settings
    database: {
        host: 'localhost',
        username: 'root',
        password: 'user123',
        port: '3306',
        db:     'node_test'
    },
    //server details
    server: {
        host:   '127.0.0.1',
        port:   '3000'
    }
}
};
module.exports = config;