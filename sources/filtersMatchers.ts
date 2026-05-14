import { Matchers } from '../generated-types/type-defs';

export const defaultMatchers = {
  text: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactInputMatcher,
    Matchers.ContainsMatcher,
    Matchers.ContainsNotMatcher,
    Matchers.RegexMatcher,
  ],
  date: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactInputMatcher,
    Matchers.MinIncludedMatcher,
    Matchers.MaxIncludedMatcher,
    Matchers.InBetweenMatcher,
  ],
  number: [
    Matchers.ExactInputMatcher,
    Matchers.MinIncludedMatcher,
    Matchers.MaxIncludedMatcher,
    Matchers.InBetweenMatcher,
  ],
  selection: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactAutoCompleteMatcher,
    Matchers.ContainsMatcher,
    Matchers.ContainsNotMatcher,
  ],
  selectionForMetadata: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactAutoCompleteMatcher,
    Matchers.ExactInputMatcher,
    Matchers.ContainsMatcher,
    Matchers.ContainsNotMatcher,
  ],
  selectionForRelation: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactAutoCompleteMatcher,
    Matchers.ContainsMatcher,
    Matchers.ContainsNotMatcher,
  ],
  boolean: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactInputMatcher,
  ],
  geo: [
    Matchers.GeoMatcher
  ],
  type: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactInputMatcher,
    Matchers.ContainsMatcher,
  ],
};
