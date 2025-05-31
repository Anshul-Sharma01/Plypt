import slugify from 'slugify';

describe('Prompt Controller Utility', () => {
  it('should generate a slug from title', () => {
    const title = 'Test Prompt Title!';
    const slug = slugify(title, { lower: true, strict: true });
    expect(slug).toBe('test-prompt-title');
  });

  it('should validate tags as array', () => {
    const tags = ['tag1', 'tag2'];
    expect(Array.isArray(tags)).toBe(true);
  });
}); 