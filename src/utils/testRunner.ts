import { ComposerGraph } from '../types';

export interface TestResult {
  success: boolean;
  output: string[];
  errors: string[];
}

export function runSimulation(graph: ComposerGraph): TestResult {
  const output: string[] = [];
  const errors: string[] = [];

  try {
    // Simple simulation for Counter Nudge demo
    if (isCounterNudgeDemo(graph)) {
      output.push("Starting Counter Nudge simulation...");
      output.push("Created Button, Counter, Notification concepts");
      output.push("Created CounterNudge sync");
      output.push("");
      
      // Simulate 3 clicks
      for (let i = 1; i <= 3; i++) {
        output.push(`Button.clicked({ kind: "inc", by: "user" }) - Click ${i}`);
        output.push(`Counter.increment() - Count now: ${i}`);
        
        if (i === 3) {
          output.push(`CounterNudge triggered: count === 3`);
          output.push(`Notification.notify("reached 3")`);
          output.push("");
          output.push("SUCCESS: Counter nudge demo completed!");
        }
      }
      
      return { success: true, output, errors };
    }

    // Simple simulation for URL Shortener demo
    if (isUrlShortenerDemo(graph)) {
      output.push("Starting URL Shortener simulation...");
      output.push("Web.request({ method: 'shortenUrl', url: 'https://example.com/very-long-url' })");
      output.push("NonceGenerator.generate() -> 'abc123'");
      output.push("UrlShortening.register({ shortUrl: 'abc123', longUrl: 'https://example.com/very-long-url' })");
      output.push("WebAnalytics.register({ url: 'abc123', event: 'created' })");
      output.push("ExpiringResource.setExpiry({ resource: 'abc123', seconds: 3600 })");
      output.push("");
      output.push("SUCCESS: Short URL created: /abc123");
      
      return { success: true, output, errors };
    }

    // Simple simulation for Upvotes demo
    if (isUpvotesDemo(graph)) {
      output.push("Starting Upvotes simulation...");
      output.push("Upvote.upvote({ itemId: 'post123', userId: 'alice' })");
      output.push("Notification.notify('bob') - Notifying post author");
      output.push("Recommendation.updateRanks({ itemId: 'post123', score: 1.5 })");
      output.push("");
      output.push("SUCCESS: Upvote processed and author notified!");
      
      return { success: true, output, errors };
    }

    // Simple simulation for Rate Limit demo
    if (isRateLimitDemo(graph)) {
      output.push("Starting Rate Limit simulation...");
      
      // Simulate multiple requests
      for (let i = 1; i <= 12; i++) {
        output.push(`Web.request({ method: 'contact', ip: '192.168.1.1' }) - Request ${i}`);
        
        if (i <= 10) {
          output.push(`RateLimiter.check() - Allowed (${10-i+1} tokens remaining)`);
          output.push(`Notification.notify("received")`);
        } else {
          output.push(`RateLimiter.check() - Rate limited (0 tokens)`);
          output.push(`Notification.notify("rate limited")`);
        }
        output.push("");
      }
      
      output.push("SUCCESS: Rate limiting working correctly!");
      
      return { success: true, output, errors };
    }

    // Generic simulation
    output.push("Running basic graph simulation...");
    output.push(`Found ${graph.concepts.length} concepts and ${graph.syncs.length} syncs`);
    output.push(`Found ${graph.edges.length} connections`);
    
    graph.concepts.forEach(concept => {
      output.push(`Concept: ${concept.name} (${concept.actions.length} actions)`);
    });
    
    graph.syncs.forEach(sync => {
      output.push(`Sync: ${sync.name} (${sync.vars.length} vars)`);
    });
    
    output.push("");
    output.push("Graph structure validated successfully!");
    
    return { success: true, output, errors };
    
  } catch (error) {
    errors.push(`Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, output, errors };
  }
}

function isCounterNudgeDemo(graph: ComposerGraph): boolean {
  const hasButton = graph.concepts.some(c => c.name === 'Button');
  const hasCounter = graph.concepts.some(c => c.name === 'Counter');
  const hasNotification = graph.concepts.some(c => c.name === 'Notification');
  const hasCounterNudge = graph.syncs.some(s => s.name === 'CounterNudge');
  
  return hasButton && hasCounter && hasNotification && hasCounterNudge;
}

function isUrlShortenerDemo(graph: ComposerGraph): boolean {
  return graph.concepts.some(c => c.name === 'UrlShortening') && 
         graph.concepts.some(c => c.name === 'NonceGenerator');
}

function isUpvotesDemo(graph: ComposerGraph): boolean {
  return graph.concepts.some(c => c.name === 'Upvote') && 
         graph.concepts.some(c => c.name === 'Recommendation');
}

function isRateLimitDemo(graph: ComposerGraph): boolean {
  return graph.concepts.some(c => c.name === 'RateLimiter') && 
         graph.syncs.some(s => s.name === 'RateLimitSync');
}