import React from 'react';
import wait from 'waait';
import {mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import AddFavoriteFoodToUser from '../AddFavoriteFoodToUser';
import ADD_FAVORITE_FOOD_MUTATION from '../ADD_FAVORITE_FOOD_MUTATION';
import USER_QUERY from '../USER_QUERY';

const renderComponent = (userId, update, mocks) => {
  return mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AddFavoriteFoodToUser userId={userId} update={update} />
    </MockedProvider>
  );
};

describe('AddFavoriteFoodToUser', () => {
  describe('when the user adds a new favorite food', () => {
    it('Submits the mutation and renders success', async () => {
      const newFoodName = 'Delicious Food';
      const newEatingFrequency = 'DAILY';
      const userId = 123;
      const mocks = [
        {
          request: {
            query: ADD_FAVORITE_FOOD_MUTATION,
            variables: {
              userId,
              name: newFoodName,
              eatingFrequency: newEatingFrequency,
            },
          },
          result: {
            data: {
              addFavoriteFood: {
                id: 456,
                foodItem: {
                  id: 789,
                  name: newFoodName,
                },
                eatingFrequency: newEatingFrequency,
              },
            },
          },
        },
      ];

      const updateSpy = jest.fn();

      const component = renderComponent(userId, updateSpy, mocks);

      component
        .find('input')
        .simulate('change', {target: {value: newFoodName}});
      component
        .find('select')
        .simulate('change', {target: {value: newEatingFrequency}});
      component.find('form').simulate('submit');

      await wait(0);
      component.update();

      expect(updateSpy).toHaveBeenCalledWith(userId);
      expect(component.find('.success-message').text()).toEqual('You did it!');
    });
  });
});
