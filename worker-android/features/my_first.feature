Feature: End to end Mileage

  @android
  Scenario: As a user I can register fillup
    Given I press "Fillup"
    Then I take a screenshot
    When I enter text "9000" into field with id "price"
    And I enter text "10" into field with id "volume"
    And I enter text "30000" into field with id "odometer"
    And I press the "Save Fillup" button
    Then I press "History"
    Then I see the text "19"

@android
  Scenario: As a user I can register vehicle
    Given I press "Vehicles"
    Then I press "Default vehicle"
    Then I clear "title"
    When I enter text "Mazda" into field with id "title"
    Then I take a screenshot
    Then I clear "year"
    And I enter text "2019" into field with id "year"
    Then I clear "make"
    And I enter text "626" into field with id "make"
    Then I clear "model"
    And I enter text "Sedan" into field with id "model"
    And I press the "Save changes" button
    Then I see the text "Mazda"

@android
  Scenario: As a user I can see statistics
    Given I press "Statistics"
    Then I take a screenshot
