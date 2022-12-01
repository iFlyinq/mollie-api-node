import TransformingNetworkClient from '../../../communication/TransformingNetworkClient';
import List from '../../../data/list/List';
import Capture from '../../../data/payments/captures/Capture';
import { CaptureData } from '../../../data/payments/captures/data';
import renege from '../../../plumbing/renege';
import Callback from '../../../types/Callback';
import Binder from '../../Binder';
import { IterateParameters, ListParameters } from './parameters';

export function getPathSegments(settlementId: string) {
  return `settlements/${settlementId}/captures`;
}

export default class SettlementCapturesBinder extends Binder<CaptureData, Capture> {
  constructor(protected readonly networkClient: TransformingNetworkClient) {
    super();
  }

  /**
   * Retrieve all captures in a certain settlement.
   *
   * Captures are used for payments that have the *authorize-then-capture* flow. The only payment methods at the moment that have this flow are *Klarna Pay now*, *Klarna Pay later* and *Klarna Slice
   * it*. Captures are created when (part of) an Order is shipped. The capture is then settled to the merchant.
   *
   * @since 3.7.0
   * @see https://docs.mollie.com/reference/v2/settlements-api/list-settlement-captures
   */
  public page(parameters: ListParameters): Promise<List<Capture>>;
  public page(parameters: ListParameters, callback: Callback<List<Capture>>): void;
  public page(parameters: ListParameters) {
    if (renege(this, this.page, ...arguments)) return;
    const { settlementId, ...query } = parameters;
    return this.networkClient.list<CaptureData, Capture>(getPathSegments(settlementId), 'captures', query).then(result => this.injectPaginationHelpers(result, this.page, parameters));
  }

  /**
   * Retrieve all captures in a certain settlement.
   *
   * Captures are used for payments that have the *authorize-then-capture* flow. The only payment methods at the moment that have this flow are *Klarna Pay now*, *Klarna Pay later* and *Klarna Slice
   * it*. Captures are created when (part of) an Order is shipped. The capture is then settled to the merchant.
   *
   * @since 3.7.0
   * @see https://docs.mollie.com/reference/v2/settlements-api/list-settlement-captures
   */
  public iterate(parameters: IterateParameters) {
    const { settlementId, valuesPerMinute, ...query } = parameters;
    return this.networkClient.iterate<CaptureData, Capture>(getPathSegments(settlementId), 'captures', query, valuesPerMinute);
  }
}