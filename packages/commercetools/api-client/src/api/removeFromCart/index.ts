import { CustomQuery } from '@vue-storefront/core';
import updateCart from './../updateCart';
import { CartDetails, CartResponse } from './../../types/Api';
import { LineItem } from './../../types/GraphQL';
import { createRemoveLineItemAction } from '../../helpers/actions/cart';

const removeFromCart = async (
  context,
  { id, version }: CartDetails,
  product: LineItem,
  customQuery?: CustomQuery
): Promise<CartResponse> => {
  return await updateCart(
    context,
    {
      id,
      version,
      actions: [createRemoveLineItemAction(product)]
    },
    customQuery
  );
};

export default removeFromCart;
