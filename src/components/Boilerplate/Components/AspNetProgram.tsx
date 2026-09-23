import React from 'react';
import { Data, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const AspNetProgram = (props: Props) => {
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  let src = `var builder = WebApplication.CreateBuilder(args);
`;

  if (has('mediator')) {
    src += `
builder.Services.AddShinyMediator(cfg => cfg.AddMediatorRegistry());`;
  }
  if (has('stores')) {
    src += `
builder.Services.AddShinyStores();`;
  }
  if (has('localization')) {
    src += `
builder.Services.AddStronglyTypedLocalizations();`;
  }
  if (has('documentdb')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new SqliteDatabaseProvider("Data Source=mydata.db");
});`;
  }
  if (has('documentdb-sqlserver')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new SqlServerDatabaseProvider("Server=localhost;Database=mydb;Trusted_Connection=true;");
});`;
  }
  if (has('documentdb-mysql')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new MySqlDatabaseProvider("Server=localhost;Database=mydb;User=root;Password=pass;");
});`;
  }
  if (has('documentdb-postgresql')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new PostgreSqlDatabaseProvider("Host=localhost;Database=mydb;Username=postgres;Password=pass;");
});`;
  }
  if (has('documentdb-oracle')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new OracleDatabaseProvider("User Id=myuser;Password=pass;Data Source=localhost:1521/FREEPDB1");
});`;
  }
  if (has('documentdb-mariadb')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new MariaDbDatabaseProvider("Server=localhost;Database=mydb;User=root;Password=pass;");
});`;
  }
  if (has('documentdb-cockroachdb')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new CockroachDbDatabaseProvider("Host=localhost;Port=26257;Username=root;Database=defaultdb;SSL Mode=Disable;");
});`;
  }
  if (has('documentdb-sqlcipher')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new SqlCipherDatabaseProvider("mydata.db", "mySecretKey");
});`;
  }
  if (has('documentdb-duckdb')) {
    src += `
builder.Services.AddDocumentStore(opts =>
{
    opts.DatabaseProvider = new DuckDbDatabaseProvider("Data Source=mydata.duckdb");
});`;
  }
  if (has('documentdb-cosmosdb')) {
    src += `
builder.Services.AddSingleton(new CosmosDbDocumentStoreOptions
{
    ConnectionString = "AccountEndpoint=https://...;AccountKey=...",
    DatabaseName = "mydb"
});
builder.Services.AddSingleton<IDocumentStore, CosmosDbDocumentStore>();`;
  }
  if (has('documentdb-mongodb')) {
    src += `
builder.Services.AddSingleton(new MongoDbDocumentStoreOptions
{
    ConnectionString = "mongodb://localhost:27017",
    DatabaseName = "mydb"
});
builder.Services.AddSingleton<IDocumentStore, MongoDbDocumentStore>();`;
  }
  if (has('documentdb-litedb')) {
    src += `
builder.Services.AddSingleton(new LiteDbDocumentStoreOptions
{
    ConnectionString = "Filename=mydata.db"
});
builder.Services.AddSingleton<IDocumentStore, LiteDbDocumentStore>();`;
  }
  if (has('documentdb-azuretable')) {
    src += `
builder.Services.AddAzureTableDocumentStore(o =>
{
    o.ConnectionString = builder.Configuration.GetConnectionString("DocumentDb")!;
    o.TableName = "Documents";
});`;
  }
  if (has('documentdb-dynamodb')) {
    src += `
// The AWS standard credential chain is used by default
builder.Services.AddDynamoDbDocumentStore(o =>
{
    o.TableName = "Documents";
    o.Region = Amazon.RegionEndpoint.USEast1;
});`;
  }
  if (has('documentdb-amazondocumentdb')) {
    src += `
builder.Services.AddDocumentDbDocumentStore(o =>
{
    o.ConnectionString = builder.Configuration.GetConnectionString("DocumentDb")!;
    o.DatabaseName = "mydb";
    // o.CaCertificatePath = "global-bundle.pem";   // Amazon RDS CA bundle
});`;
  }
  if (has('documentdb-redis')) {
    src += `
builder.Services.AddRedisDocumentStore(o => o.ConnectionString = "localhost:6379");`;
  }
  if (has('documentdb-ravendb')) {
    src += `
builder.Services.AddRavenDbDocumentStore(o =>
{
    o.Urls = ["http://localhost:8080"];
    o.Database = "mydb";
});`;
  }
  if (has('documentdb-firestore')) {
    src += `
builder.Services.AddFirestoreDocumentStore(o => o.ProjectId = "your-project-id");`;
  }
  if (has('documentdb-ai')) {
    src += `

// Exposes document store operations to an LLM - see https://shinylib.net/documentdb/ai-tools/
builder.Services.AddDocumentStoreAITools(tools =>
{
    // tools.AddType(jsonContext.SomeType, capabilities: DocumentAICapabilities.ReadOnly);
});`;
  }
  if (has('appdevicebridge')) {
    src += `

// Hands out signed web app releases to App Device Bridge hosts - https://shinylib.net/appdevicebridge/updates
builder.Services.AddWebAppReleases(o =>
{
    o.SigningKey = builder.Configuration["WebApps:SigningKey"];   // PEM, from your secret store
    o.ReleasesDirectory = "/srv/webapps";
});`;
  }
  if (has('serialization')) {
    src += `
builder.Services.AddJsonSerialization();`;
  }
  if (has('extensions-push')) {
    src += `
// Server-side dispatch. APNs, FCM, Web Push & WNS all live in the core package - add the
// transports you actually send through. Omit UseDocumentDb() for the in-memory repository.
builder.Services.AddPushNotifications(push =>
{
    push.AddApns(o =>
    {
        o.TeamId   = "ABCDE12345";
        o.KeyId    = "KEY1234567";
        o.BundleId = "com.example.app";
        o.PrivateKeyPath = "AuthKey_KEY1234567.p8";
    });
    push.UseDocumentDb(o => o.DatabaseProvider = new SqliteDatabaseProvider("Data Source=push.db"));
});`;
  }
  if (has('di')) {
    src += `
builder.Services.AddGeneratedServices();`;
  }
  if (has('webhost')) {
    src += `
builder.AddInfrastructureModules(new YourModule());`;
  }
  // Reflector is attribute-based only, no builder registration needed

  src += `

var app = builder.Build();
`;

  if (has('webhost')) {
    src += `app.UseInfrastructureModules();
`;
  }
  if (has('appdevicebridge')) {
    src += `app.MapWebAppReleases("/webapps");
`;
  }
  if (has('mediator')) {
    src += `app.MapGeneratedMediatorEndpoints();
`;
  }

  src += `app.Run();`;

  return (<Syntax source={src} language="csharp" />);
};

export default AspNetProgram;
