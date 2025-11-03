/**
 * Widget Model Tests
 * Tests for Widget and WidgetData models
 */

import { Widget, WidgetType } from '../Widget';
import { WidgetData, BankWidgetData } from '../WidgetData';

describe('WidgetData', () => {
  describe('Constructor', () => {
    test('should create empty WidgetData', () => {
      const widgetData = new WidgetData();
      expect(widgetData.isEmpty()).toBe(true);
    });

    test('should create WidgetData with data', () => {
      const data = { temperature: 72, condition: 'Sunny' };
      const widgetData = new WidgetData(data);
      expect(widgetData.getField('temperature')).toBe(72);
      expect(widgetData.getField('condition')).toBe('Sunny');
    });
  });

  describe('Data Manipulation', () => {
    test('should get and set fields', () => {
      const widgetData = new WidgetData();
      widgetData.setField('balance', 12345.67);
      expect(widgetData.getField('balance')).toBe(12345.67);
    });

    test('should update existing field', () => {
      const widgetData = new WidgetData({ balance: 100 });
      widgetData.setField('balance', 200);
      expect(widgetData.getField('balance')).toBe(200);
    });
  });

  describe('Serialization', () => {
    test('should serialize to JSON string', () => {
      const data = { temperature: 72, condition: 'Sunny' };
      const widgetData = new WidgetData(data);
      const json = widgetData.toJSON();
      
      expect(typeof json).toBe('string');
      const parsed = JSON.parse(json);
      expect(parsed.temperature).toBe(72);
      expect(parsed.condition).toBe('Sunny');
    });

    test('should deserialize from JSON string', () => {
      const jsonString = '{"temperature":72,"condition":"Sunny"}';
      const widgetData = WidgetData.fromJSON(jsonString);
      
      expect(widgetData.getField('temperature')).toBe(72);
      expect(widgetData.getField('condition')).toBe('Sunny');
    });

    test('should handle null JSON string', () => {
      const widgetData = WidgetData.fromJSON(null);
      expect(widgetData.isEmpty()).toBe(true);
    });

    test('should handle invalid JSON string', () => {
      const widgetData = WidgetData.fromJSON('invalid json');
      expect(widgetData.isEmpty()).toBe(true);
    });
  });

  describe('Validation', () => {
    test('should validate valid data object', () => {
      const widgetData = new WidgetData({ temperature: 72 });
      expect(widgetData.validate()).toBe(true);
    });

    test('should invalidate null data', () => {
      const widgetData = new WidgetData(null as unknown as {});
      expect(widgetData.validate()).toBe(false);
    });
  });
});

describe('Widget', () => {
  describe('Constructor', () => {
    test('should create widget with required fields', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'weather',
        title: 'Weather',
      });

      expect(widget.id).toBe('widget-1');
      expect(widget.userId).toBe('user-1');
      expect(widget.type).toBe('weather');
      expect(widget.title).toBe('Weather');
      expect(widget.positionX).toBe(0);
      expect(widget.positionY).toBe(0);
      expect(widget.width).toBe(1);
      expect(widget.height).toBe(1);
    });

    test('should use default values for optional fields', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'weather',
        title: 'Weather',
      });

      expect(widget.positionX).toBe(0);
      expect(widget.positionY).toBe(0);
      expect(widget.width).toBe(1);
      expect(widget.height).toBe(1);
      expect(widget.data).toEqual({});
    });
  });

  describe('Data Management', () => {
    test('should set widget data', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'bank',
        title: 'Bank Account',
      });

      const data: BankWidgetData = {
        accountNumber: '•••• 4321',
        balance: 12345.67,
      };

      widget.setData(data);
      expect(widget.data.accountNumber).toBe('•••• 4321');
      expect(widget.data.balance).toBe(12345.67);
    });

    test('should update data field', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'weather',
        title: 'Weather',
      });

      widget.updateDataField('temperature', 75);
      expect(widget.data.temperature).toBe(75);
    });

    test('should serialize and deserialize data', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'weather',
        title: 'Weather',
        data: { temperature: 72, condition: 'Sunny' },
      });

      const json = widget.serializeData();
      expect(typeof json).toBe('string');

      widget.deserializeData(json);
      expect(widget.data.temperature).toBe(72);
      expect(widget.data.condition).toBe('Sunny');
    });
  });

  describe('Validation', () => {
    test('should validate complete widget', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'weather',
        title: 'Weather',
        data: { temperature: 72 },
      });

      expect(widget.validate()).toBe(true);
    });

    test('should invalidate widget with missing id', () => {
      const widget = new Widget({
        userId: 'user-1',
        type: 'weather',
        title: 'Weather',
      });

      expect(widget.validate()).toBe(false);
    });

    test('should invalidate widget with missing userId', () => {
      const widget = new Widget({
        id: 'widget-1',
        type: 'weather',
        title: 'Weather',
      });

      expect(widget.validate()).toBe(false);
    });

    test('should invalidate widget with invalid type', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'invalid' as WidgetType,
        title: 'Widget',
      });

      expect(widget.validate()).toBe(false);
    });
  });

  describe('API Response Format', () => {
    test('should convert to API response format', () => {
      const widget = new Widget({
        id: 'weather-1',
        userId: 'user-1',
        type: 'weather',
        title: 'Weather',
        data: { temperature: 72, condition: 'Sunny' },
        lastUpdated: new Date('2024-11-03T12:00:00Z'),
      });

      const apiResponse = widget.toAPIResponse();

      expect(apiResponse.id).toBe('weather-1');
      expect(apiResponse.type).toBe('weather');
      expect(apiResponse.title).toBe('Weather');
      expect(apiResponse.data.temperature).toBe(72);
      expect(apiResponse.lastUpdated).toBe('2024-11-03T12:00:00.000Z');
    });

    test('should use current date if lastUpdated not set', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'weather',
        title: 'Weather',
      });

      delete widget.lastUpdated;
      const apiResponse = widget.toAPIResponse();

      expect(apiResponse.lastUpdated).toBeDefined();
      expect(typeof apiResponse.lastUpdated).toBe('string');
      expect(() => new Date(apiResponse.lastUpdated)).not.toThrow();
    });
  });

  describe('Database Serialization', () => {
    test('should convert to database row format', () => {
      const widget = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'bank',
        title: 'Bank Account',
        positionX: 0,
        positionY: 1,
        width: 1,
        height: 1,
        data: { balance: 12345.67 },
        createdAt: new Date('2024-11-01T10:00:00Z'),
        updatedAt: new Date('2024-11-03T12:00:00Z'),
      });

      const dbRow = widget.toDatabaseRow();

      expect(dbRow.id).toBe('widget-1');
      expect(dbRow.user_id).toBe('user-1');
      expect(dbRow.type).toBe('bank');
      expect(dbRow.title).toBe('Bank Account');
      expect(dbRow.position_x).toBe(0);
      expect(dbRow.position_y).toBe(1);
      expect(dbRow.width).toBe(1);
      expect(dbRow.height).toBe(1);
      expect(typeof dbRow.config).toBe('string');
      
      const parsedConfig = JSON.parse(dbRow.config);
      expect(parsedConfig.balance).toBe(12345.67);
    });

    test('should create from database row', () => {
      const dbRow = {
        id: 'widget-1',
        user_id: 'user-1',
        type: 'weather',
        title: 'Weather',
        position_x: 1,
        position_y: 2,
        width: 1,
        height: 1,
        config: '{"temperature":72,"condition":"Sunny"}',
        created_at: '2024-11-01T10:00:00Z',
        updated_at: '2024-11-03T12:00:00Z',
      };

      const widget = Widget.fromDatabaseRow(dbRow);

      expect(widget.id).toBe('widget-1');
      expect(widget.userId).toBe('user-1');
      expect(widget.type).toBe('weather');
      expect(widget.title).toBe('Weather');
      expect(widget.positionX).toBe(1);
      expect(widget.positionY).toBe(2);
      expect(widget.data.temperature).toBe(72);
      expect(widget.data.condition).toBe('Sunny');
      expect(widget.lastUpdated).toBeInstanceOf(Date);
    });

    test('should handle null config in database row', () => {
      const dbRow = {
        id: 'widget-1',
        user_id: 'user-1',
        type: 'weather',
        title: 'Weather',
        position_x: 0,
        position_y: 0,
        width: 1,
        height: 1,
        config: null,
        created_at: '2024-11-01T10:00:00Z',
        updated_at: '2024-11-03T12:00:00Z',
      };

      const widget = Widget.fromDatabaseRow(dbRow);
      expect(widget.data).toEqual({});
    });
  });

  describe('Cloning', () => {
    test('should create a copy of the widget', () => {
      const original = new Widget({
        id: 'widget-1',
        userId: 'user-1',
        type: 'bank',
        title: 'Bank Account',
        data: { balance: 12345.67 },
      });

      const cloned = original.clone();

      expect(cloned.id).toBe(original.id);
      expect(cloned.userId).toBe(original.userId);
      expect(cloned.type).toBe(original.type);
      expect(cloned.data.balance).toBe(original.data.balance);
      expect(cloned).not.toBe(original);
      expect(cloned.data).not.toBe(original.data); // Different object reference
    });
  });
});

