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
  if (has('di')) {
    src += `
builder.Services.AddShinyServiceRegistry();`;
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
  if (has('mediator')) {
    src += `app.MapGeneratedMediatorEndpoints();
`;
  }

  src += `app.Run();`;

  return (<Syntax source={src} language="csharp" />);
};

export default AspNetProgram;
