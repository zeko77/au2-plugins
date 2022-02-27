import { IAppConfiguration } from '@starnetbih/au2-configuration';
import { IApiRegistry, IRest, IRestRequest } from '@starnetbih/au2-api';
import { IAuthService } from '@starnetbih/au2-auth';

export class MyApp {
  constructor(
    @IAppConfiguration private Configuration: IAppConfiguration,
    @IApiRegistry private Reg: IApiRegistry,
    @IAuthService private Auth: IAuthService
  ) { }

  async attached() {
    await this.login();
    //await this.callGoogleApi();
    await this.callLookupsApi();
  }
  public message = 'Hello World!';

  private async callLookupsApi() {
    let rest = this.Reg.getEndpoint('lookupsApi');
    let resp = await rest.find({ resource: '/ba/entities?pageSize=10' });
    console.log(resp);
    let resp1 = await rest.find({ resource: '/ba/entities', idOrCriteria: { pageSize: 10 } });
    console.log(resp1);

    let req = {
      currentPage: 0,
      pageSize: 10,
      qry: {
        "name": "filterByName",
        "startsWith ": "b",
        "lng": "bs_cyrl_ba",
        "collection": "settlements"
      }
    };
    let resp3 = await rest.post({ resource: '/typeaheads', body: req });
    console.log(resp3);
  }

  private async callGoogleApi() {
    let rest = this.Reg.getEndpoint('googleApi');
    let resp = await rest.find({ resource: '/CurrencyExchange/GetJson?date=02%2F26%2F2022%2000%3A00%3A00' });
    console.log(resp);
  }

  private async login() {
    let u = await this.Auth.login({ provider: "credentials", username: "admin", password: "admin" }, {});
    console.log(u);
    console.log(this.Auth.getTokenPayload());
  }
}
