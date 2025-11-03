/**
 * Dashboard Controller Tests
 * Tests for GET /api/dashboard endpoint
 */

import request from 'supertest';
import app from '../index';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_DATABASE = 'data/test_morning_board.db';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';

describe('GET /api/dashboard', () => {
  test('should return dashboard data with widgets array', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .expect(200);

    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('widgets');
    expect(response.body).toHaveProperty('layout');
    expect(response.body).toHaveProperty('lastSync');
    expect(Array.isArray(response.body.widgets)).toBe(true);
    expect(Array.isArray(response.body.layout)).toBe(true);
  });

  test('should return widgets with correct structure', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .expect(200);

    const widgets = response.body.widgets;
    expect(widgets.length).toBeGreaterThan(0);

    widgets.forEach((widget: any) => {
      expect(widget).toHaveProperty('id');
      expect(widget).toHaveProperty('type');
      expect(widget).toHaveProperty('title');
      expect(widget).toHaveProperty('data');
      expect(widget).toHaveProperty('lastUpdated');

      // Validate widget type
      expect(['weather', 'slack', 'canvas', 'bank', 'crm']).toContain(widget.type);
    });
  });

  test('should include all widget types', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .expect(200);

    const widgets = response.body.widgets;
    const widgetTypes = widgets.map((w: any) => w.type);

    expect(widgetTypes).toContain('weather');
    expect(widgetTypes).toContain('slack');
    expect(widgetTypes).toContain('canvas');
    expect(widgetTypes).toContain('bank');
    expect(widgetTypes).toContain('crm');
  });

  test('should include widget-specific data', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .expect(200);

    const widgets = response.body.widgets;

    // Check weather widget data
    const weatherWidget = widgets.find((w: any) => w.type === 'weather');
    expect(weatherWidget).toBeDefined();
    expect(weatherWidget.data).toHaveProperty('temperature');
    expect(weatherWidget.data).toHaveProperty('condition');
    expect(weatherWidget.data).toHaveProperty('location');

    // Check bank widget data
    const bankWidget = widgets.find((w: any) => w.type === 'bank');
    expect(bankWidget).toBeDefined();
    expect(bankWidget.data).toHaveProperty('balance');
    expect(bankWidget.data).toHaveProperty('accountNumber');
    expect(bankWidget.data).toHaveProperty('accountType');

    // Check slack widget data
    const slackWidget = widgets.find((w: any) => w.type === 'slack');
    expect(slackWidget).toBeDefined();
    expect(slackWidget.data).toHaveProperty('unreadCount');
    expect(slackWidget.data).toHaveProperty('recentMessages');
  });

  test('should return valid ISO date strings for lastUpdated', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .expect(200);

    const widgets = response.body.widgets;

    widgets.forEach((widget: any) => {
      expect(typeof widget.lastUpdated).toBe('string');
      expect(() => new Date(widget.lastUpdated)).not.toThrow();
    });
  });

  test('should include layout information', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .expect(200);

    const layout = response.body.layout;
    expect(layout.length).toBeGreaterThan(0);

    layout.forEach((item: any) => {
      expect(item).toHaveProperty('widgetId');
      expect(item).toHaveProperty('position');
      expect(item).toHaveProperty('size');
      expect(item.position).toHaveProperty('x');
      expect(item.position).toHaveProperty('y');
      expect(item.size).toHaveProperty('width');
      expect(item.size).toHaveProperty('height');
    });
  });

  test('should return lastSync timestamp', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .expect(200);

    expect(response.body.lastSync).toBeDefined();
    expect(new Date(response.body.lastSync).getTime()).toBeLessThanOrEqual(
      Date.now()
    );
  });

  test('should have CORS headers', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .set('Origin', 'http://localhost:19006')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).toBeTruthy();
  });
});

