import { Links, Url } from '../../global';
import Model from '../../Model';
import OrderLine, { OrderLineData, injectPrototypes as injectOrderLinePrototypes } from '../orderlines/OrderLine';
import Seal from '../../../types/Seal';
import commonHelpers from '../../commonHelpers';

export interface ShipmentData extends Model<'shipment'> {
  /**
   * The order this shipment was created on, for example `ord_8wmqcHMN4U`.
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/get-shipment?path=orderId#response
   */
  orderId: string;
  /**
   * The shipment's date and time of creation, in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/get-shipment?path=createdAt#response
   */
  createdAt: string;
  /**
   * An object containing shipment tracking details. Will be omitted when no tracking details are available.
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/get-shipment?path=tracking#response
   */
  tracking?: ShipmentTracking;
  /**
   * An array of order line objects as described in Get order.
   *
   * The lines will show the `quantity`, `discountAmount`, `vatAmount` and `totalAmount` shipped in this shipment. If the line was partially shipped, these values will be different from the values in
   * response from the Get order API.
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/get-shipment?path=lines#response
   */
  lines: OrderLineData[];
  /**
   * An object with several URL objects relevant to the shipment. Every URL object will contain an `href` and a `type` field.
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/get-shipment?path=_links#response
   */
  _links: ShipmentLinks;
}

type Shipment = Seal<ShipmentData & { lines: OrderLine[] }, typeof commonHelpers>;

export default Shipment;

export interface ShipmentLinks extends Links {
  order: Url;
}

export interface ShipmentTracking {
  carrier: string;
  code: string;
  url?: string;
}

export function injectPrototypes(input: ShipmentData): Shipment {
  return Object.assign(Object.create(commonHelpers), input, {
    lines: input.lines.map(injectOrderLinePrototypes),
  });
}
