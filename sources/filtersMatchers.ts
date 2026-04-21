import { Matchers } from '../generated-types/type-defs';

export const defaultMatchers = {
  text: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactMatcher,
    Matchers.ContainsMatcher,
    Matchers.ContainsNotMatcher,
    Matchers.RegexMatcher,
  ],
  date: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactMatcher,
    Matchers.MinIncludedMatcher,
    Matchers.MaxIncludedMatcher,
    Matchers.InBetweenMatcher,
  ],
  number: [
    Matchers.ExactMatcher,
    Matchers.MinIncludedMatcher,
    Matchers.MaxIncludedMatcher,
    Matchers.InBetweenMatcher,
  ],
  selection: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactMatcher,
    Matchers.ContainsMatcher,
    Matchers.ContainsNotMatcher,
  ],
  boolean: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactMatcher
  ],
  geo: [
    Matchers.GeoMatcher
  ],
  type: [
    Matchers.AnyMatcher,
    Matchers.NoneMatcher,
    Matchers.ExactMatcher,
    Matchers.ContainsMatcher,
  ],
};
